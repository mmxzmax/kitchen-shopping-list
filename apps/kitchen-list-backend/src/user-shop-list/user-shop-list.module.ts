import { Module } from '@nestjs/common';
import { UserShopListService } from './user-shop-list.service';
import { UserShopListController } from './user-shop-list.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserShopListEntity } from './models/user-shop-list.entity';
import { UsersModule } from '../users/users.module';
import { GoodsListModule } from '../goods-list/goods-list.module';

@Module({
  imports: [
    UsersModule,
    GoodsListModule,
    TypeOrmModule.forFeature([UserShopListEntity]),
  ],
  providers: [UserShopListService],
  controllers: [UserShopListController],
  exports: [UserShopListService],
})
export class UserShopListModule {}
