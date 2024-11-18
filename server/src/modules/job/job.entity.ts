import { Entity, Column, type Relation, PrimaryGeneratedColumn, ManyToOne, JoinColumn, BaseEntity, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Division } from "../division/division.entity";
import { Candidate } from "../candidate/candidate.entity";

@Entity()
export class Job extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @OneToMany(() => Candidate, (candidate) => candidate.job)
  @JoinColumn({ name: "candidate_id" })
  candidates: Relation<Candidate>;

  @ManyToOne(() => Division, (division) => division.jobs)
  @JoinColumn({ name: "division_id" })
  division: Relation<Division>;
}
