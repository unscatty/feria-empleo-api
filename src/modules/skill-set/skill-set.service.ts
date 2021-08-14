import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SkillSet } from './entities/skill-set.entity';

@Injectable()
export class SkillSetService {
  constructor(
    @InjectRepository(SkillSet)
    private skillSetRepository: Repository<SkillSet>,
  ) {}

  findAllSkillSets() {
    return this.skillSetRepository.find();
  }
}
