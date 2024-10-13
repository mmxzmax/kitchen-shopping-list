import { Injectable, NotFoundException } from '@nestjs/common';
import { GoodSCategoryEntity } from './models/goods-category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGoodsCategoryDto } from './models/create-goods-category.dto';

@Injectable()
export class GoodsCategoriesService {

    constructor(
        @InjectRepository(GoodSCategoryEntity)
        private categoryRepository: Repository<GoodSCategoryEntity>
      ) {}


    async list() {
        return this.categoryRepository.find({order:  {id: 'ASC'}});
    }

    async categoryById(id: number) {
        return this.categoryRepository.findOneBy({id});
    }

    async createCategory(category: CreateGoodsCategoryDto) {
        const newCategory = this.categoryRepository.create(category);
        return this.categoryRepository.save(newCategory);
    }

    async editCategory(id: number, data: CreateGoodsCategoryDto) {
        const item = await this.categoryById(id);
        if(item) {
            const edited = this.categoryRepository.merge(item, data);
            return this.categoryRepository.save(edited);
        }
        throw new NotFoundException();
    }

    async deleteCategory(id: number) {
        const item = await this.categoryById(id);
        if(item) {
            return this.categoryRepository.delete({id});
        }
        return;
    }
}
