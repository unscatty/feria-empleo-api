import {
  AzureStorageService,
  UploadedFileMetadata,
} from '@nestjs/azure-storage';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { verify } from 'jsonwebtoken';
import { isEmpty, isUndefined } from 'lodash';
import { EnvConfig } from 'src/config/config.keys';
import { UploadedImage } from 'src/shared/entitities/uploaded-image.entity';
import { EntityManager, FindConditions, Repository } from 'typeorm';
import { CreateUserDto } from '../user/dto';
import { Role } from '../user/entities/role.entity';
import { RoleType, User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { companyLabels } from './company-labels';
import { CompanyEmailService } from './company-mail.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { Company } from './entities/company.entity';

@Injectable()
export class CompanyService {
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
  ) {}

  public async createCompany(company: CreateCompanyDto): Promise<Company> {
    const companyToCreate: Company = await this.fillCompanyToCreate(company);
    return this.companyRepository.save(companyToCreate);
  }

  // TODO: refactor this as separate function
  private modifyFilename(filename: string, folderName: string): string {
    return `${folderName}/${new Date().toISOString()}-${filename}`;
  }

  private async uploadImageFile(
    imageFile: UploadedFileMetadata,
    email: string,
  ) {
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
    manager: EntityManager,
  ): Promise<Company> {
    let uploadedImage: UploadedImage;

    if (imageFile) {
      uploadedImage = await this.uploadImageFile(
        imageFile,
        companyToInvite.email,
      );
    } else if (companyToInvite.imageURL && companyToInvite.imageURL === '') {
      uploadedImage = await this.uploadedImageRepository.create({
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

  public async retrieveCompanies(): Promise<Company[]> {
    const companyFilter: Company = new Company();
    companyFilter.isActive = true;
    const foundCompanies: Company[] = await this.companyRepository.find(
      companyFilter,
    );
    if (isEmpty(foundCompanies)) {
      throw new NotFoundException(companyLabels.errors.companiesNotFound);
    }
    return foundCompanies;
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

    const updatedCompany = await this.companyRepository.save({
      ...existingCompany,
      user: newUser,
    });

    return {
      company: updatedCompany,
      user: updatedCompany.user,
    };
  }

  public async validateInvitationToken(token: string): Promise<Company> {
    const payload = await verify(token, this.config.get(EnvConfig.JWT_SECRET), {
      ignoreExpiration: false,
    });

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
    let updatedCompany: any;
    if (isUndefined(id)) {
      throw new BadRequestException(companyLabels.errors.noIdProvided);
    }
    updatedCompany = await this.companyRepository.update({ id: id }, company);
    if (isUndefined(updatedCompany)) {
      throw new NotFoundException(companyLabels.errors.updateCompanyError);
    }
    return company;
  }

  public async deleteCompany(id: number): Promise<Company> {
    const companyToDelete: Company = new Company();
    companyToDelete.isActive = false;
    if (isUndefined(id)) {
      throw new BadRequestException(companyLabels.errors.noIdProvided);
    }
    await this.companyRepository.update({ id: id }, companyToDelete);
    companyToDelete.id = id;
    return companyToDelete;
  }

  private async fillCompanyToCreate(
    company: CreateCompanyDto,
  ): Promise<Company> {
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
