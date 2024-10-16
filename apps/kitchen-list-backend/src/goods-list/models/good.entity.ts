import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GoodSCategoryEntity } from '../../goods-categories/models/goods-category.entity';
import { UserShopListEntity } from '../../user-shop-list/models/user-shop-list.entity';

@Entity()
export class GoodEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => GoodSCategoryEntity, (list) => list.goods, {
    cascade: true,
  })
  @JoinTable()
  categories: GoodSCategoryEntity[];

  @ManyToMany(() => UserShopListEntity, (list) => list.goods)
  listGoods: UserShopListEntity[];

  @ManyToMany(() => UserShopListEntity, (list) => list.completedGoods)
  listCompletedGoods: UserShopListEntity[];

  @DeleteDateColumn()
  deleteDate: Date;
}
