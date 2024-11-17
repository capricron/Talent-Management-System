import { Context } from "hono";
import { response } from "../../helper/response";
import { AuthService } from "./auth.service";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async login(c: Context) {
    try {
      const { email, password } = await c.req.json();

      const result = await this.authService.login({ email, password });

      return response(c, 200, result, "auth");
    } catch (e) {
      return response(c, e.status || 400, e.data || null, "auth");
    }
  }
}
