import { StateMachineFactory } from '@depthlabs/nestjs-state-machine';
import { StateMachine } from '@depthlabs/nestjs-state-machine/dist/state-machine';
import { AzureStorageService, UploadedFileMetadata } from '@nestjs/azure-storage';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { verify } from 'jsonwebtoken';
import { isUndefined } from 'lodash';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { EnvConfig } from 'src/config/config.keys';
import { UploadedImage } from 'src/core/entities/uploaded-image.entity';
import { COMPANY_GRAPH_NAME, COMPANY_TRANSITIONS } from 'src/core/state-machines/company.graph';
import {
  EntityManager,
  FindConditions,
  Repository,
  Transaction,
  TransactionManager,
} from 'typeorm';
import { CreateUserDto } from '../user/dto';
import { Role } from '../user/entities/role.entity';
import { RoleType, User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { companyLabels } from './company-labels';
import { CompanyEmailService } from './company-mail.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { FilterCompanyDto } from './dto/filter-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { Company } from './entities/company.entity';

const MAX_COMPANIES = 70;
@Injectable()
export class CompanyService {
  getCurrent: typeof UserService.prototype.getCompany;

  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(UploadedImage)
    private readonly uploadedImageRepository: Repository<UploadedImage>,
    private companyEmailService: CompanyEmailService,
    private config: ConfigService,
    private userService: UserService,
    private readonly azureStorage: AzureStorageService,
    private readonly stateMachineFactory: StateMachineFactory
  ) {
    this.getCurrent = this.userService.getCompany;
  }

  private getStateMachine(company: Company): StateMachine<Company> {
    // TODO: inject graph name
    return this.stateMachineFactory.create<Company>(company, COMPANY_GRAPH_NAME);
  }

  public async createCompany(company: CreateCompanyDto): Promise<Company> {
    const companyToCreate: Company = await this.fillCompanyToCreate(company);
    return this.companyRepository.save(companyToCreate);
  }

  // TODO: refactor this as separate function
  private modifyFilename(filename: string, folderName: string): string {
    return `${folderName}/${new Date().toISOString()}-${filename}`;
  }

  private async uploadImageFile(imageFile: UploadedFileMetadata, email: string) {
    // Modify filename before uploading
    imageFile = {
      ...imageFile,
      originalname: this.modifyFilename(imageFile.originalname, email),
    };

    const imageURL = await this.azureStorage.upload(imageFile);

    return this.uploadedImageRepository.create({ imageURL: imageURL });
  }

  // TODO: check if company already registered
  public async inviteCompany(
    companyToInvite: CreateCompanyDto,
    imageFile: UploadedFileMetadata,
    manager: EntityManager
  ): Promise<Company> {
    let uploadedImage: UploadedImage;

    if (imageFile) {
      uploadedImage = await this.uploadImageFile(imageFile, companyToInvite.email);
    } else if (companyToInvite.imageURL && companyToInvite.imageURL !== '') {
      uploadedImage = this.uploadedImageRepository.create({
        imageURL: companyToInvite.imageURL,
      });
    }

    const companyToCreate = this.companyRepository.create({
      invitationEmail: companyToInvite.email,
      name: companyToInvite.name,
      activeEmail: companyToInvite.email,
      image: uploadedImage,
    });

    const company = await manager.save(companyToCreate);

    await this.companyEmailService.sendInvitation(companyToInvite);

    return company;
  }

  public async findAll(dto: FilterCompanyDto): Promise<Pagination<Company>> {
    return paginate<Company>(this.companyRepository, { ...dto, limit: MAX_COMPANIES });
  }

  public async retrieveOneCompany(companyId: number): Promise<Company> {
    const filterQuery: FindConditions<Company> = {
      isActive: true,
      id: companyId,
    };
    const companyFound = await this.companyRepository.findOne(filterQuery);
    if (isUndefined(companyFound)) {
      throw new NotFoundException(companyLabels.errors.companyNotFound);
    }
    return companyFound;
  }

  // TODO: use transaction
  public async register(token: string, userDto: CreateUserDto) {
    const existingCompany = await this.validateInvitationToken(token);
    const newUser = await this.userService.createCompany(userDto);

    existingCompany.user = newUser;

    const stateMachine = this.getStateMachine(existingCompany);

    // Try to change state
    await stateMachine.apply(COMPANY_TRANSITIONS.REGISTER);

    const updatedCompany = await this.companyRepository.save(existingCompany);

    return updatedCompany;
  }

  public async validateInvitationToken(token: string): Promise<Company> {
    let payload: any;

    try {
      payload = verify(token, this.config.get(EnvConfig.JWT_SECRET), {
        ignoreExpiration: false,
      });
    } catch (error) {
      throw error;
    }

    const email = payload['email'] as string;

    const existingCompany = await this.companyRepository.findOne({
      invitationEmail: email,
    });

    if (!existingCompany) {
      throw new NotFoundException('INVITED_COMPANY_NOT_FOUND');
    }

    return existingCompany;
  }

  public async resendInvitation(companyId: string | number) {
    const existingCompany = await this.companyRepository.findOne(companyId);
    if (!existingCompany) {
      throw new NotFoundException('INVITED_COMPANY_NOT_FOUND');
    }

    await this.companyEmailService.sendInvitation({
      email: existingCompany.invitationEmail,
      name: existingCompany.name,
    });
  }

  public async updateCompany(id: number, company: Company): Promise<Company> {
    if (isUndefined(id)) {
      throw new BadRequestException(companyLabels.errors.noIdProvided);
    }
    const updatedCompany = await this.companyRepository.update({ id: id }, company);
    if (isUndefined(updatedCompany)) {
      throw new NotFoundException(companyLabels.errors.updateCompanyError);
    }
    return company;
  }

  // Update image from uploaded file
  @Transaction()
  public async updateImage(
    company: Company,
    updateImageDto: UpdateImageDto,
    @TransactionManager() manager?: EntityManager
  ): Promise<string> {
    const uploadedImage = await this.uploadImageFile(updateImageDto.image, company.invitationEmail);

    company.image = uploadedImage;

    const updatedCompany =
      (await manager?.save(company)) || (await this.companyRepository.save(company));

    return updatedCompany.image.imageURL;
  }

  @Transaction()
  public async update(
    company: Company,
    updateCompanyDto: UpdateCompanyDto,
    @TransactionManager() manager?: EntityManager
  ): Promise<Company> {
    // Merge company data with DTO data to update it later in the database
    const { useEmail, ...updateFields } = updateCompanyDto;

    const mergedWithDto = manager.merge(Company, company, {
      ...updateFields,
      // Use either invitation email or user email as current active email
      // Do not change if no option present in DTO
      activeEmail: company.getAvailableEmail(useEmail),
    });

    // Update merged data
    const updatedCompany = await manager.save(mergedWithDto);

    return updatedCompany;
  }

  public async deleteCompany(id: string | number) {
    return this.companyRepository.delete(id);
  }

  private async fillCompanyToCreate(company: CreateCompanyDto): Promise<Company> {
    const createdUser: User = await this.createUserForCompany(company);
    const companyToCreate: Company = new Company();
    companyToCreate.user = createdUser;
    return companyToCreate;
  }

  private async createUserForCompany(company: CreateCompanyDto): Promise<User> {
    const user: User = new User();
    const role: Role = await this.roleRepository.findOne({
      name: RoleType.COMPANY,
    });
    user.email = company.email;
    user.createdAt = new Date();
    user.updatedAt = user.createdAt;
    user.role = role;
    return await this.userRepository.save(user);
  }

  private async createImageUpload(imageURL: string): Promise<UploadedImage> {
    const createdImage = this.uploadedImageRepository.create({
      imageURL: imageURL,
    });

    return this.uploadedImageRepository.save(createdImage);
  }
}
