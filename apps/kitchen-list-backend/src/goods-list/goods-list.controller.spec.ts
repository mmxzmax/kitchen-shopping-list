import { Test, TestingModule } from '@nestjs/testing';
import { GoodsListController } from './goods-list.controller';
import { TypeOrmSQLITETestingModule } from '../test-utils/TypeORMSQLITETestingModule';
import { GoodsListService } from './goods-list.service';

describe('GoodsListController', () => {
  let controller: GoodsListController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmSQLITETestingModule()],
      providers: [GoodsListService],
      controllers: [GoodsListController],
    }).compile();

    controller = module.get<GoodsListController>(GoodsListController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
