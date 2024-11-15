import { DivisionRepo } from "./division.repo";

export class DivisionService{

    private readonly divisionRepo: DivisionRepo

    constructor(){
        this.divisionRepo = new DivisionRepo;
    }
    
    async createDivision(req: any){
        const {name} = req

        try{
            const data = {...req}

            return await this.divisionRepo.createDivision(data)
        }catch(e){
            return e;
        }
    }

}