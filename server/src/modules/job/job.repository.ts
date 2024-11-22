import { AppDataSource } from "../../data-source";
import { Division } from "../division/division.entity";
import { Job } from "./job.entity";

export class JobRepository {
  async createJob(data: { name: string; description: string; requirement: string; division: Division }) {
    const job = new Job();

    job.name = data?.name;
    job.division = data?.division;
    job.requirement = data?.requirement;
    job.description = data?.description;
    
    return await AppDataSource.manager.save(job);
  }

  async getJobById(job_id: string) {
    return await AppDataSource.getRepository(Job).findOneBy({ id: job_id });
  }

  async getAllJob() {
    return await AppDataSource.getRepository(Job).find();
  }
}
