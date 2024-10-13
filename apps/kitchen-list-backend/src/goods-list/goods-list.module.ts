import { Module } from '@nestjs/common';
import { GoodsListService } from './goods-list.service';
import { GoodsListController } from './goods-list.controller';
import { GoodEntity } from './models/good.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoodsCategoriesModule } from '../goods-categories/goods-categories.module';
import { GoodSCategoryEntity } from '../goods-categories/models/goods-category.entity';

@Module({
  imports: [GoodsCategoriesModule, TypeOrmModule.forFeature([GoodEntity, GoodSCategoryEntity])],
  providers: [GoodsListService],
  controllers: [GoodsListController],
  exports: [GoodsListService],
})
export class GoodsListModule {}
