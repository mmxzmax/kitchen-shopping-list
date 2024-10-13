import { Test, TestingModule } from '@nestjs/testing';
import { GoodsCategoriesController } from './goods-categories.controller';

describe('GoodsCategoriesController', () => {
  let controller: GoodsCategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GoodsCategoriesController],
    }).compile();

    controller = module.get<GoodsCategoriesController>(GoodsCategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
