import { Injectable, NotFoundException } from '@nestjs/common';
import { GoodEntity } from './models/good.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IGood } from './models/good.interface';
import { CreateGoodDto } from './models/create-good.dto';
import { GoodsCategoriesService } from '../goods-categories/goods-categories.service';

@Injectable()
export class GoodsListService {
  constructor(
    @InjectRepository(GoodEntity)
    private goodsRepository: Repository<GoodEntity>,
    private readonly categoryService: GoodsCategoriesService
  ) {}

  async list() {
    return this.goodsRepository.find({
      relations: {
        categories: true,
      },
    });
  }

  listByIds(ids: number[]) {
    return this.goodsRepository.findBy({ id: In(ids) });
  }

  async getLetters(categoryId?: number) {
    const res = await this.goodsRepository
      .createQueryBuilder('good')
      .select('DISTINCT LOWER(SUBSTRING(good.name, 1, 1))', 'name')
      .leftJoin('good.categories', 'category')
      .where('category.id = :categoryId OR category.id IS NULL', { categoryId })
      .getRawMany();
    return res?.map(({ name }) => String(name).toLocaleUpperCase());
  }

  async getListByLetter(letter: string, categoryId?: number): Promise<IGood[]> {
    const res = await this.goodsRepository
      .createQueryBuilder('good')
      .select(['good.id', 'good.name'])
      .leftJoin('good.categories', 'category')
      .where(
        `(category.id = :categoryId OR category.id IS NULL) AND (LOWER(good.name) LIKE :letter || '%')`,
        {
          letter: letter?.toLocaleLowerCase(),
          categoryId,
        }
      )
      .getRawMany();
    return res.map(({ good_id, good_name }) => ({
      id: good_id,
      name: good_name,
    }));
  }

  async getItemById(id: number) {
    return this.goodsRepository.findOne({
      where: { id },
      relations: {
        categories: true,
      },
    });
  }

  async findByName(name: string) {
    return this.goodsRepository.findOneBy({ name });
  }

  private async _getCategories(ids: number[]) {
    if (ids?.length) {
      return await Promise.all(
        ids.map((catId) => this.categoryService.categoryById(catId))
      );
    }
    return [];
  }

  async createGood(good: CreateGoodDto) {
    const exist = await this.findByName(good.name);
    if (exist) {
      return exist;
    }
    const newGood = this.goodsRepository.create({
      name: good.name,
      categories: await this._getCategories(good?.categories),
    });
    return this.goodsRepository.save(newGood);
  }

  async deleteItem(id: number) {
    const item = await this.getItemById(id);
    if (item) {
      item.categories = [];
      item.listCompletedGoods = [];
      item.listGoods = [];
      await this.goodsRepository.save(item);
      await this.goodsRepository.delete({id});
      return { ok: true };
    }
    return;
  }

  async editItem(id: number, data: CreateGoodDto) {
    const item = await this.getItemById(id);
    if (item) {
      const edited = this.goodsRepository.merge(item, {
        name: data.name,
        categories: await this._getCategories(data?.categories),
      });
      return this.goodsRepository.save(edited);
    }
    throw new NotFoundException();
  }
}
