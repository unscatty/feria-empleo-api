import { Test, TestingModule } from '@nestjs/testing';
import { TopJobPostsController } from '../top-job-posts.controller';

describe('TopJobPostsController', () => {
  let controller: TopJobPostsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TopJobPostsController],
    }).compile();

    controller = module.get<TopJobPostsController>(TopJobPostsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
