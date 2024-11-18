import { AppDataSource } from "../../data-source";
import { Division } from "../division/division.entity";
import { Job } from "../job/job.entity";
import { Candidate } from "./candidate.entity";

export class CandidateRepository {
  async createCandidate(data: { name: string; cv: string; job?: Job }) {
    const candidate = new Candidate();

    candidate.name = data?.name;
    candidate.cv = data?.cv;
    candidate.job = data?.job;

    return await AppDataSource.manager.save(candidate);
  }
}
