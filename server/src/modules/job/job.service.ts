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

  async createJob(data: { name: string; division_id: string }) {
    const division = await this.divisionRepo.getDivisionById(data?.division_id);

    if (!division) throwError(404, "Divisi tidak ditemukan");

    return await this.jobRepo.createJob({ name: data.name, division });
  }

  async getAllJob() {
    return await this.jobRepo.getAllJob();
  }
}
