import { throwError } from "../../helper/response";
import { DivisionRepo } from "./division.repo";

export class DivisionService {
  private readonly divisionRepo: DivisionRepo;

  constructor() {
    this.divisionRepo = new DivisionRepo();
  }

  async createDivision(req: any) {
    const { name } = req;

    try {
      const data = { ...req };

      return await this.divisionRepo.createDivision(data);
    } catch (e) {
      return e;
    }
  }

  async editDivisionById(data: { id: string; name: string }) {
    const result = await this.divisionRepo.editDivisionById(data);

    if (!result) throwError(404, "Data tidak ditemukan");

    return result;
  }

  async deleteDivisionById(id: string) {
    const result = await this.divisionRepo.deleteDivisionById(id);

    if (!result) throwError(404, "Data tidak ditemukan");

    return result;
  }

  async getAllDivision() {
    return await this.divisionRepo.getAllDivision();
  }
}
