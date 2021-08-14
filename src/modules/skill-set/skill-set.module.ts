import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SkillSet } from './entities/skill-set.entity';
import { SkillSetController } from './skill-set.controller';
import { SkillSetService } from './skill-set.service';

@Module({
  imports: [TypeOrmModule.forFeature([SkillSet])],
  controllers: [SkillSetController],
  providers: [SkillSetService],
})
export class SkillSetModule {}
