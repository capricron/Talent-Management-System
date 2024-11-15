import { Hono } from "hono";
import { DivisionController } from "./division.controller";

const divisionRoute = new Hono();
const divisionController = new DivisionController();

divisionRoute.post("/", (c) => divisionController.createDivision(c));

export default divisionRoute;
