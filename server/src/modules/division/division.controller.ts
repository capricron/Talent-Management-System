import { Context } from "hono";
import { DivisionService } from "./division.service";
import { response } from "../../helper/response";

export class DivisionController {
  private divisionService: DivisionService;

  constructor() {
    this.divisionService = new DivisionService();
  }

  async createDivision(c: Context) {
    const req = await c.req.json();

    const data = await this.divisionService.createDivision(req);

    return response(c, 201, data, "divisi");
  }

  async editDivisionById(c: Context) {
    try {
      const { id } = c.req.param();
      const { name } = await c.req.json();

      const result = await this.divisionService.editDivisionById({ id, name });

      return response(c, 200, result, "divisi");
    } catch (e) {
      return response(c, e.status || 400, e.data || null, "divisi");
    }
  }
  async deleteDivisionById(c: Context) {
    try {
      const { id } = c.req.param();

      const result = await this.divisionService.deleteDivisionById(id);

      return response(c, 200, result, "divisi");
    } catch (e) {
      return response(c, e.status || 400, e.data || null, "divisi");
    }
  }

  async getAllDivision(c: Context) {
    try {
      const result = await this.divisionService.getAllDivision();

      return response(c, 200, result, "divisi");
    } catch (e) {
      return response(c, e.status || 400, e.data || null, "divisi");
    }
  }
}
