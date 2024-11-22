import { Hono } from "hono";
import { authorize } from "../../middleware/authorize.middleware";
import { CandidateController } from "./candidate.controller";

const candidateRoute = new Hono();
const candidateController = new CandidateController();

candidateRoute.post("/", (c) => candidateController.createCandidate(c));

export default candidateRoute;
