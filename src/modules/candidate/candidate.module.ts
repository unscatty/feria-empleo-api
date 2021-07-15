import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Candidate } from './models/candidate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Candidate])],
})
export class CandidateModule {}
