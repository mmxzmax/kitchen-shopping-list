import { Test, TestingModule } from '@nestjs/testing';
import { GoodsCategoriesService } from './goods-categories.service';

describe('GoodsCategoriesService', () => {
  let service: GoodsCategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GoodsCategoriesService],
    }).compile();

    service = module.get<GoodsCategoriesService>(GoodsCategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
