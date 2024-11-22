import { throwError } from "../../helper/response";
import { DivisionRepo } from "../division/division.repo";
import { JobRepository } from "./job.repository";

export class JobService {
  private jobRepo: JobRepository;
  private divisionRepo: DivisionRepo;

  constructor() {
    this.jobRepo = new JobRepository();
    this.divisionRepo = new DivisionRepo();
  }

  async createJob(data: { name: string; division_id: string, description: string, requirement: string }) {
   try{
    const division = await this.divisionRepo.getDivisionById(data?.division_id);

    if (!division) throwError(404, "Divisi tidak ditemukan");

    return await this.jobRepo.createJob({ name: data.name, description: data.description, requirement: data.requirement, division });
   }catch(e){
      console.log(e)
   }
  }

  async getAllJob() {
    return await this.jobRepo.getAllJob();
  }
}
