import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../users/models/user.entity';
import { GoodEntity } from '../../goods-list/models/good.entity';

@Entity()
export class UserShopListEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  date: Date;

  @Column()
  comleted: boolean;

  @ManyToOne(() => UserEntity, (user) => user.lists, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;

  @ManyToMany(() => GoodEntity, (list) => list.listGoods, { cascade: true })
  @JoinTable()
  goods: GoodEntity[];

  @ManyToMany(() => GoodEntity, (list) => list.listCompletedGoods, {
    cascade: true,
  })
  @JoinTable()
  completedGoods: GoodEntity[];

  @DeleteDateColumn()
  deleteDate: Date;
}
