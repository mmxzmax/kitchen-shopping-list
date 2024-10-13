import { Module } from '@nestjs/common';
import { GoodsCategoriesController } from './goods-categories.controller';
import { GoodsCategoriesService } from './goods-categories.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoodSCategoryEntity } from './models/goods-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GoodSCategoryEntity])],
  controllers: [GoodsCategoriesController],
  providers: [GoodsCategoriesService],
  exports: [GoodsCategoriesService],
})
export class GoodsCategoriesModule {}
