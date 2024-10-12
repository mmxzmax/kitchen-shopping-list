import { Test, TestingModule } from '@nestjs/testing';
import { GoodsListController } from './goods-list.controller';

describe('GoodsListController', () => {
  let controller: GoodsListController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GoodsListController],
    }).compile();

    controller = module.get<GoodsListController>(GoodsListController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
