import { Test, TestingModule } from '@nestjs/testing';
import { UserShopListService } from './user-shop-list.service';

describe('UserShopListService', () => {
  let service: UserShopListService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserShopListService],
    }).compile();

    service = module.get<UserShopListService>(UserShopListService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
