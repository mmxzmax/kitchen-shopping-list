import { Injectable } from '@nestjs/common';
import { UserShopListEntity } from './models/user-shop-list.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { GoodsListService } from '../goods-list/goods-list.service';
import { CreateUserShopListDto } from './models/create-user-shop-list.dto';
import { EditUserShopListDto } from './models/edit-user-shop-list.dto';

@Injectable()
export class UserShopListService {
  constructor(
    @InjectRepository(UserShopListEntity)
    private listRepository: Repository<UserShopListEntity>,
    private _userService: UsersService,
    private _goodsServcie: GoodsListService
  ) {}

  private async _getUserById(id) {
    return await this._userService.getUserById(id);
  }

  private async _goodsListByIds(ids: number[]) {
    return await this._goodsServcie.listByIds(ids);
  }

  async list(userId: number) {
    return await this.listRepository.find({
      relations: {
        user: false,
      },
      where: {
        user: await this._getUserById(userId),
      },
    });
  }

  async listById(userId: number, id: number) {
    return this.listRepository.findOne({
      relations: {
        user: false,
        goods: true,
        completedGoods: true
      },
      where: {
        user: await this._getUserById(userId),
        id,
      },
    });
  }

  async createList(userId: number, data: CreateUserShopListDto) {
    const newList = this.listRepository.create({
      name: data.name,
      goods: [],
      completedGoods: [],
      user: await this._getUserById(userId),
      date: new Date(),
      comleted: false,
    });
    return await this.listRepository.save(newList);
  }

  async editList(id: number, userId: number, data: EditUserShopListDto) {
    const existList = await this.listById(userId, id);
    const newList = this.listRepository.merge(existList, {
      name: data.name,
      goods: await this._goodsListByIds(data.goods),
      completedGoods: await this._goodsListByIds(data.completedGoods),
      comleted: data.goods?.every(g => data.completedGoods.includes(g)),
      date: new Date(),
    });
    return await this.listRepository.save(newList);
  }

  async deleteList(id: number, userId: number) {
    const existList = await this.listById(userId, id);
    return await this.listRepository.softRemove(existList);
  }
}
