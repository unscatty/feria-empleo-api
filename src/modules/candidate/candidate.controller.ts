import { Body, Controller, Post, UseGuards } from '@nestjs/common';
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
}
