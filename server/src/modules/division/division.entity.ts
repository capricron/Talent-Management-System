import { Entity, Column, type Relation, PrimaryGeneratedColumn, ManyToOne, JoinColumn, BaseEntity, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Division extends BaseEntity{

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

}