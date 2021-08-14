import { Controller, Get } from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';
import { SkillSetService } from './skill-set.service';

@Controller('skill-set')
export class SkillSetController {
  constructor(private skillSetService: SkillSetService) {}

  @Get()
  @Public()
  findAllSkillSets() {
    return this.skillSetService.findAllSkillSets();
  }
}
