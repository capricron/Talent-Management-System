import { createCV } from "../../helper/cv";
import { throwError } from "../../helper/response";
import { Job } from "../job/job.entity";
import { JobRepository } from "../job/job.repository";
import { CandidateRepository } from "./candidate.repository";
import processPdf from "../../AI/ocr"
import saveAsPdf from "../../helper/images";
import jobMatch from "../../AI/jobMatch";
export class CandidateService {
  private candidateRepo: CandidateRepository;
  private jobRepo: JobRepository;

  constructor() {
    this.candidateRepo = new CandidateRepository();
    this.jobRepo = new JobRepository();
  }

  async createCandidate(data: { name: string; cv: any; job_id: string; job?: Job }) {

    try {
      const job = await this.jobRepo.getJobById(data.job_id)
      await saveAsPdf(data.cv);

      const result = await processPdf();
      const persentase = await jobMatch(job.requirement, result)

      return {
        name: data.name,
        job: job.name,
        persentase
      }

    }catch(e){
      console.log(e)
    }
    
    // data.job = await this.jobRepo.getJobById(data?.job_id);

    // if (!data.job) throwError(404, "Data job tidak ditemukan");
    // const name_file = `${Date.now()}`;
    // data.cv = await createCV(data.cv, name_file, "cv");

    // return await this.candidateRepo.createCandidate({ ...data });
  }
}
