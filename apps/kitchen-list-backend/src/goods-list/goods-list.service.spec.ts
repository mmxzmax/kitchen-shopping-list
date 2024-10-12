import { Test, TestingModule } from '@nestjs/testing';
import { GoodsListService } from './goods-list.service';

describe('GoodsListService', () => {
  let service: GoodsListService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GoodsListService],
    }).compile();

    service = module.get<GoodsListService>(GoodsListService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
