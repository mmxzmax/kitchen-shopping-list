import { Column, DeleteDateColumn, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { GoodEntity } from "../../goods-list/models/good.entity";

@Entity()
export class GoodSCategoryEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToMany(() => GoodEntity, (list) => list.categories)
    goods: GoodEntity[]

    @DeleteDateColumn()
    deleteDate: Date;
}