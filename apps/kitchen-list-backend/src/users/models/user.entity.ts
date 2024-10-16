import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  DeleteDateColumn,
} from 'typeorm';
import { UserShopListEntity } from '../../user-shop-list/models/user-shop-list.entity';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  role: string;

  @Column()
  salt: string;

  @OneToMany(() => UserShopListEntity, (list) => list.user, {
    cascade: true,
  })
  lists: UserShopListEntity[];

  @DeleteDateColumn()
  deleteDate: Date;
}
