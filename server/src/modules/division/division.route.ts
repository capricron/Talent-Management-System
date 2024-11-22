import { Hono } from "hono";
import { DivisionController } from "./division.controller";
import { authorize } from "../../middleware/authorize.middleware";

const divisionRoute = new Hono();
const divisionController = new DivisionController();

divisionRoute.post("/", (c) => divisionController.createDivision(c));
divisionRoute.put("/:id", authorize, (c) => divisionController.editDivisionById(c));
divisionRoute.delete("/:id", authorize, (c) => divisionController.deleteDivisionById(c));
divisionRoute.get("/", authorize, (c) => divisionController.getAllDivision(c));

export default divisionRoute;
