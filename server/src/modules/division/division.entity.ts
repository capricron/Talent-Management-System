import { Entity, Column, type Relation, PrimaryGeneratedColumn, ManyToOne, JoinColumn, BaseEntity, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Job } from "../job/job.entity";

@Entity()
export class Division extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @OneToMany(() => Job, (job) => job.division)
  @JoinColumn({ name: "job_id" })
  jobs: Relation<Job>;
}
