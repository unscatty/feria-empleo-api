import { Test, TestingModule } from '@nestjs/testing';
import { TopJobPostsService } from '../top-job-posts.service';

describe('TopJobPostsService', () => {
  let service: TopJobPostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TopJobPostsService],
    }).compile();

    service = module.get<TopJobPostsService>(TopJobPostsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
