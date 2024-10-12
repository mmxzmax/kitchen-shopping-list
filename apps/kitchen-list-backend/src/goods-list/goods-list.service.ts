import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GoodEntity } from './models/good.entity';
import { Raw, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IGood } from './models/good.interface';
import { CreateGoodDto } from './models/create-good.dto';
import { map } from 'rxjs';

@Injectable()
export class GoodsListService {
  constructor(
    @InjectRepository(GoodEntity)
    private goodsRepository: Repository<GoodEntity>
  ) {}

  async getLetters() {
    const res = await this.goodsRepository
      .createQueryBuilder().orderBy('name', 'ASC')
      .select('DISTINCT LOWER(SUBSTRING(name, 1, 1))', 'name')
      .getRawMany();
    return res?.map(({name}) => String(name).toLocaleUpperCase());
  }

  async getListByLetter(letter: string): Promise<IGood[]> {
    const res = await this.goodsRepository
      .createQueryBuilder().select(['id', 'name'])
      .where(`LOWER(name) LIKE :letter || '%'`, {letter: letter?.toLocaleLowerCase()})
      .getRawMany();
      return res;
  }

  async getItemById(id: number) {
    return this.goodsRepository.findOneBy({ id });
  }

  async findByName(name: string) {
    return this.goodsRepository.findOneBy({ name });
  }

  async createGood(good: CreateGoodDto) {
    const exist = await this.findByName(good.name);
    if (exist) {
      return exist;
    }
    const newGood = this.goodsRepository.create(good);
    return this.goodsRepository.save(newGood);
  }

  async deleteItem(id: number) {
    const item = await this.getItemById(id);
    if (item) {
      return this.goodsRepository.delete(item);
    }
    return;
  }

  async editItem(id: number, data: CreateGoodDto) {
    const item = await this.getItemById(id);
    if (item) {
      const edited = this.goodsRepository.merge(item, data);
      return this.goodsRepository.save(edited);
    }
    throw new NotFoundException();
  }
}
