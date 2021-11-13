import { UploadedFileMetadata } from '@nestjs/azure-storage';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  SerializeOptions,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Email } from 'src/core/mailer/interfaces/email.interfaces';
import { IMailerService } from 'src/core/mailer/interfaces/mailer-service.interface';
import { StateMachineExceptionInterceptor } from 'src/core/state-machines/interceptors/state-machine-exception.interceptor';
import { EntityManager, Transaction, TransactionManager } from 'typeorm';
import { Public } from '../auth/decorators/public.decorator';
import { Allow } from '../auth/decorators/role.decorator';
import { GetUser } from '../auth/decorators/user.decorator';
import { RegisterGuard } from '../auth/strategies/b2c-register.strategy';
import { CreateUserDto } from '../user/dto';
import { RoleGroup } from '../user/entities/role.entity';
import { RoleType, User } from '../user/entities/user.entity';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { FilterCompanyDto } from './dto/filter-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { Company } from './entities/company.entity';

@Controller('company')
export class CompanyController {
  constructor(
    private readonly companyService: CompanyService,
    private readonly mailerService: IMailerService
  ) {}

  @Get('mail')
  @UseInterceptors(FileInterceptor('image'))
  async sendMail(@Body() body: Email, @UploadedFile() imageFile: UploadedFileMetadata) {
    body.attachments = [
      {
        filename: imageFile.originalname,
        content: imageFile.buffer, //.toString('base64'),
        contentType: imageFile.mimetype,
        // encoding: 'base64',
      } as any,
    ];

    console.log(typeof imageFile.buffer);

    console.log(`econding: ${imageFile.encoding}`);
    console.log(`myme type: ${imageFile.mimetype}`);

    console.log(body.attachments[0].content);

    await this.mailerService.sendMail(body);
  }

  @Post('')
  @Allow(RoleType.ADMIN)
  createCompany(@Body() createCompanyDto?: CreateCompanyDto) {
    return this.companyService.createCompany(createCompanyDto);
  }

  // TODO: role and auth guards
  // TODO: check if file is an image
  @Post('invite')
  @Public()
  // @Allow(RoleType.ADMIN)
  @UseInterceptors(FileInterceptor('image'))
  @Transaction()
  inviteCompany(
    @Body() companyToInvite: CreateCompanyDto,
    @UploadedFile() imageFile: UploadedFileMetadata,
    @TransactionManager() manager: EntityManager
  ) {
    return this.companyService.inviteCompany(companyToInvite, imageFile, manager);
  }

  @Post('register')
  @SerializeOptions({ groups: [RoleGroup.CURRENT_USER] })
  @UseInterceptors(StateMachineExceptionInterceptor)
  @UseGuards(RegisterGuard)
  @Public()
  register(@Body('token') token: string, @GetUser() user: User) {
    const dto = new CreateUserDto();
    dto.email = user.email;
    dto.name = user.name;
    dto.lastname = user.lastname;
    return this.companyService.register(token, dto);
  }

  @Post('resend-token/:id')
  @Public()
  resendToken(@Param('id') id: string) {
    this.companyService.resendInvitation(id);
  }

  @Get('validate-invitation-token')
  @Public()
  validateInvitationToken(@Query('token') token: string) {
    this.companyService.validateInvitationToken(token);
  }

  @Get('')
  @Public()
  findAll(@Query() filterCompanyDto: FilterCompanyDto) {
    return this.companyService.findAll(filterCompanyDto);
  }

  @Get(':id')
  retrieveCompanyById(@Param('id') id: number) {
    return this.companyService.retrieveOneCompany(id);
  }

  @Put(':id')
  updateCompany(@Param('id') id: number, @Body() company: Company) {
    return this.companyService.updateCompany(id, company);
  }

  @Put('')
  @SerializeOptions({ groups: [RoleGroup.CURRENT_USER] })
  @Allow(RoleType.COMPANY)
  async updateCurrent(
    @Body() updateCompanyDto: UpdateCompanyDto,
    @GetUser() user: User
  ): Promise<Company> {
    const currentCompany = await this.companyService.getCurrent(user);

    return this.companyService.update(currentCompany, updateCompanyDto);
  }

  @Patch('update-image')
  @Allow(RoleType.COMPANY)
  @UseInterceptors(FileInterceptor('image'))
  async updateImageCurrent(
    @UploadedFile() imageFile: UploadedFileMetadata,
    @Body() imageDto: UpdateImageDto,
    @GetUser() user: User
  ) {
    imageDto.image = imageFile;

    const currentCompany = await this.companyService.getCurrent(user);

    return this.companyService.updateImage(currentCompany, imageDto);
  }

  @Delete(':id')
  @Public()
  deleteCompany(@Param('id') id: number) {
    return this.companyService.deleteCompany(id);
  }
}
