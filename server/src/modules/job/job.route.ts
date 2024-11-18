import { Hono } from "hono";
import { authorize } from "../../middleware/authorize.middleware";
import { JobController } from "./job.controller";

const jobRoute = new Hono();
const jobController = new JobController();

jobRoute.post("/", authorize, (c) => jobController.createJob(c));
jobRoute.get("/", authorize, (c) => jobController.getAllJob(c));

export default jobRoute;
