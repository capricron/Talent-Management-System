import { AppDataSource } from "../../data-source";
import { Division } from "./division.entity";

export class DivisionRepo {
  async createDivision(data: any) {
    try {
      const division = new Division();

      division.name = data.name;

      return AppDataSource.manager.save(division);
    } catch (e) {
      return e;
    }
  }

  async editDivisionById(data: { id: string; name: string }) {
    const division = await AppDataSource.getRepository(Division).findOneBy({ id: data.id });

    if (!division) return null;

    division.name = data.name;

    return await AppDataSource.manager.save(division);
  }

  async deleteDivisionById(id: string) {
    const division = await AppDataSource.getRepository(Division).findOneBy({ id: id });

    if (!division) return null;

    return await AppDataSource.manager.remove(division);
  }

  async getAllDivision() {
    return await AppDataSource.getRepository(Division).find({});
  }
}
