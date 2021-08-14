import { Test, TestingModule } from '@nestjs/testing';
import { SkillSetService } from '../skill-set.service';

describe('SkillSetService', () => {
  let service: SkillSetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SkillSetService],
    }).compile();

    service = module.get<SkillSetService>(SkillSetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
