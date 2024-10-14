import { Test, TestingModule } from '@nestjs/testing';
import { UserShopListController } from './user-shop-list.controller';

describe('UserShopListController', () => {
  let controller: UserShopListController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserShopListController],
    }).compile();

    controller = module.get<UserShopListController>(UserShopListController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
