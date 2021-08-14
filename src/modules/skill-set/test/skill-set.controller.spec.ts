import { Test, TestingModule } from '@nestjs/testing';
import { SkillSetController } from '../skill-set.controller';

describe('SkillSetController', () => {
  let controller: SkillSetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SkillSetController],
    }).compile();

    controller = module.get<SkillSetController>(SkillSetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
