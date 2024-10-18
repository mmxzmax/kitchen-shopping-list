import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  DeleteDateColumn,
} from 'typeorm';
import { UserShopListEntity } from '../../user-shop-list/models/user-shop-list.entity';
import { TgContactEntity } from './tg-contacts.entity';

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

  @Column({ nullable: true })
  tgUid: string;

  @OneToMany(() => UserShopListEntity, (list) => list.user, {
    cascade: true,
  })
  lists: UserShopListEntity[];

  @OneToMany(() => TgContactEntity, (contacts) => contacts.user, {
    cascade: true,
  })
  tgContacts: TgContactEntity[];

  @DeleteDateColumn()
  deleteDate: Date;
}
