import { Context } from "hono";
import { response } from "../../helper/response";
import { CandidateService } from "./candidate.service";

export class CandidateController {
  private candidateService: CandidateService;

  constructor() {
    this.candidateService = new CandidateService();
  }

  async createCandidate(c: Context) {
    try {
      const body: { name: string; cv: any; job_id: string } = await c.req.parseBody();

      const result = await this.candidateService.createCandidate({ ...body });

      return response(c, 200, result, "candidate");
    } catch (e) {
      console.log(e);
      return response(c, e.status || 400, e.data || null, "candidate");
    }
  }
}
