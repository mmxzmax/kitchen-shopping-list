import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity() 
export class GoodEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
}