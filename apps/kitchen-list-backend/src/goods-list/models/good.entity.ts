import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { GoodSCategoryEntity } from "../../goods-categories/models/goods-category.entity";


@Entity() 
export class GoodEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToMany(() => GoodSCategoryEntity)
    @JoinTable()
    categories: GoodSCategoryEntity[]
}