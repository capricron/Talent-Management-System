import { Context } from "hono";
import { DivisionService } from "./division.service";
import { response } from "../../helper/response";

export class DivisionController {
    private  divisionService: DivisionService

    constructor(
    ) {
        this.divisionService = new DivisionService();
    }

    async createDivision(c: Context){
        const req = await c.req.json()

        const data = await this.divisionService.createDivision(req)

        return response(c, 201, data, "divisi")
    }

}