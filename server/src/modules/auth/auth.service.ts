import { sign } from "hono/jwt";
import { throwError } from "../../helper/response";
import { AuthRepository } from "./auth.repository";
import bcryptjs = require("bcryptjs");
import { JWTPayload } from "hono/utils/jwt/types";

export class AuthService {
  private authRepo: AuthRepository;
  constructor() {
    this.authRepo = new AuthRepository();
  }
  async login(data: { email: string; password: string }) {
    const { email, password } = data;

    const user = await this.authRepo.getUserByEmail(email);

    if (!user) throwError(404, "Email atau Password salah");

    if (!bcryptjs.compareSync(password, user.password)) throwError(400, "Email atau Password salah");

    delete user.password;

    const payload: JWTPayload = {
      ...user,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
    };

    const token = await sign(payload, process.env.TOKEN_SECRET, "HS256");

    return {
      user,
      token,
    };
  }
}
