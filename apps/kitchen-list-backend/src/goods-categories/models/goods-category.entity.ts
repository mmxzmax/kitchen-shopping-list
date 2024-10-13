import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { GoodEntity } from "../../goods-list/models/good.entity";

@Entity()
export class GoodSCategoryEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
}