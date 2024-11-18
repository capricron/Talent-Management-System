import { Hono } from "hono";
import { authorize } from "../../middleware/authorize.middleware";
import { JobController } from "./job.controller";

const jobRoute = new Hono();
const jobController = new JobController();

jobRoute.post("/", authorize, (c) => jobController.createJob(c));

export default jobRoute;
