import { Module } from '@nestjs/common';
import { GoodsListService } from './goods-list.service';
import { GoodsListController } from './goods-list.controller';
import { GoodEntity } from './models/good.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([GoodEntity])],
  providers: [GoodsListService],
  controllers: [GoodsListController],
  exports: [GoodsListService],
})
export class GoodsListModule {}
