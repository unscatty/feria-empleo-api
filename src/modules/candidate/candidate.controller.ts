import { UploadedFileMetadata } from '@nestjs/azure-storage';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { EntityManager, Transaction, TransactionManager } from 'typeorm';
import { Public } from '../auth/decorators/public.decorator';
import { GetUser } from '../auth/decorators/user.decorator';
import { RegisterGuard } from '../auth/strategies/b2c-register.strategy';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { CandidateService } from './candidate.service';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { FilterCandidateDto } from './dto/filter-candidate.dto';

@Controller('candidate')
export class CandidateController {
  constructor(private candidateService: CandidateService, private userService: UserService) {}

  @Post('register')
  @Public()
  @UseGuards(RegisterGuard)
  register(@Body() createCandidateDto: CreateCandidateDto, @GetUser() user: User) {
    createCandidateDto.email = user.email;
    return this.candidateService.createCandidate(createCandidateDto);
  }

  @Get('contact')
  getContactDetails(@GetUser() user: User) {
    return this.candidateService.getContactDetails(user);
  }

  @Get('contact/:id')
  getCandidateContactDetails(@Param() filterCanidate: FilterCandidateDto) {
    return this.candidateService.getCandidateContactDetails(filterCanidate);
  }

  @Get('')
  getCandidates(@GetUser() user: User) {
    return this.candidateService.getCandidates(user);
  }

  @Get(':id')
  getCandidateById(@Param() filterCanidate: FilterCandidateDto) {
    return this.candidateService.getCandidateById(filterCanidate);
  }

  @Put('update')
  @Transaction()
  async updateCandidate(
    @Body() updateCandidateDto: CreateCandidateDto,
    @GetUser() user: User,
    @TransactionManager() manager: EntityManager
  ) {
    const candidate = await this.userService.getCandidate(user);
    return this.candidateService.updateCandidate(updateCandidateDto, manager, candidate);
  }

  @Put('update/resume')
  @UseInterceptors(FileInterceptor('resume'))
  @Transaction()
  async updateResume(
    @GetUser() user: User,
    @UploadedFile() resume: UploadedFileMetadata,
    @TransactionManager() manager: EntityManager
  ) {
    const candidate = await this.userService.getCandidate(user);
    return this.candidateService.updateResume(resume, candidate, manager);
  }
}
