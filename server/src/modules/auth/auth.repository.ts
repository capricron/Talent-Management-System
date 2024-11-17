import { AppDataSource } from "../../data-source";
import { User } from "./user.entity";

export class AuthRepository {
  async getUserByEmail(email: string) {
    return await AppDataSource.getRepository(User).findOne({
      where: {
        email,
      },
    });
  }
}
