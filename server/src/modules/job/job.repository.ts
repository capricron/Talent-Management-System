import { AppDataSource } from "../../data-source";
import { Division } from "../division/division.entity";
import { Job } from "./job.entity";

export class JobRepository {
  async createJob(data: { name: string; division: Division }) {
    const job = new Job();

    job.name = data?.name;
    job.division = data?.division;

    return await AppDataSource.manager.save(job);
  }

  async getJobById(job_id: string) {
    return await AppDataSource.getRepository(Job).findOneBy({ id: job_id });
  }
}
