import { Test, TestingModule } from '@nestjs/testing';
import { GoodsListService } from './goods-list.service';
import { TypeOrmSQLITETestingModule } from '../test-utils/TypeORMSQLITETestingModule';

describe('GoodsListService', () => {
  let service: GoodsListService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmSQLITETestingModule()],
      providers: [GoodsListService],
    }).compile();

    service = module.get<GoodsListService>(GoodsListService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
