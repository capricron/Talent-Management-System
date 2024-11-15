import { AppDataSource } from "../../data-source";
import { Division } from "./division.entity";

export class DivisionRepo {
    async createDivision(data: any){
        try{
            const division = new Division();

            division.name = data.name;

            return AppDataSource.manager.save(division)
        }catch(e){
            return e;
        }
    }
}