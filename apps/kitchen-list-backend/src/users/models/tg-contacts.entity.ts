import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity()
export class TgContactEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true})
  name: string

  @Column()
  chatId:number;

  @ManyToOne(() => UserEntity, (user) => user.tgContacts, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;
}
