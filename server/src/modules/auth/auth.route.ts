import { Hono } from "hono";
import { AuthController } from "./auth.controller";

const authRoute = new Hono();
const authController = new AuthController();

authRoute.post("/login", (c) => authController.login(c));

export default authRoute;
