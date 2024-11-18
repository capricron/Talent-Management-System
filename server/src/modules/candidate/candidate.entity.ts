import { Entity, Column, type Relation, PrimaryGeneratedColumn, ManyToOne, JoinColumn, BaseEntity, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Division } from "../division/division.entity";
import { Job } from "../job/job.entity";

@Entity()
export class Candidate extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  cv: string;

  @ManyToOne(() => Job, (job) => job.candidates)
  @JoinColumn({ name: "job_id" })
  job: Relation<Job>;
}
