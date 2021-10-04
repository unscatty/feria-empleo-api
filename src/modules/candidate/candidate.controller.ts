import { UploadedFileMetadata } from '@nestjs/azure-storage';
import { Body, Controller, Get, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { EntityManager, Transaction, TransactionManager } from 'typeorm';
import { Public } from '../auth/decorators/public.decorator';
import { GetUser } from '../auth/decorators/user.decorator';
import { RegisterGuard } from '../auth/strategies/b2c-register.strategy';
import { User } from '../user/entities/user.entity';
import { CandidateService } from './candidate.service';
import { CreateCandidateDto } from './dto/create-candidate.dto';

@Controller('candidate')
export class CandidateController {
  constructor(private candidateService: CandidateService) {}
  @Post('register')
  @Public()
  @UseGuards(RegisterGuard)
  register(@Body() createCandidateDto: CreateCandidateDto, @GetUser() user: User) {
    createCandidateDto.email = user.email;
    return this.candidateService.createCandidate(createCandidateDto);
  }

  @Get('')
  getCandidates(@GetUser() user: User) {
    return this.candidateService.getCandidates(user);
  }

  @Get('contact')
  getContactDetails(@GetUser() user: User) {    
      return this.candidateService.getContactDetails(user);
  }

  @Put('update')
  @Transaction()
  updateCandidate(
    @Body() updateCandidateDto: CreateCandidateDto,
    @GetUser() user: User,
    @TransactionManager() manager: EntityManager,
     ) {
       return this.candidateService.updateCandidate(updateCandidateDto, manager, user);
     }

     @Put('update/resume')
     @UseInterceptors(FileInterceptor('resume'))
     @Transaction()
     updateResume(
       @GetUser() user: User, 
       @UploadedFile() resume: UploadedFileMetadata,
       @TransactionManager() manager: EntityManager) {
        return this.candidateService.updateResume(resume, user, manager);
     }
}
