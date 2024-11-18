import { Context } from "hono";
import { response } from "../../helper/response";
import { JobService } from "./job.service";

export class JobController {
  private jobService: JobService;
  constructor() {
    this.jobService = new JobService();
  }
  async createJob(c: Context) {
    try {
      const { name, division_id } = await c.req.json();

      const result = await this.jobService.createJob({ name, division_id });

      return response(c, 200, result, "job");
    } catch (e) {
      return response(c, e.status || 400, e.data || null, "job");
    }
  }

  async getAllJob(c: Context) {
    try {
      const result = await this.jobService.getAllJob();

      return response(c, 200, result, "job");
    } catch (e) {
      return response(c, e.status || 400, e.data || null, "job");
    }
  }
}
