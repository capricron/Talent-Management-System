import { DataSource } from "typeorm";
import { User } from "../modules/auth/user.entity";
import bcryptjs = require("bcryptjs");

export async function runSeeder(dataSource: DataSource) {
  console.log("Running seeder...");

  const user = new User();

  user.name = "Admin";
  user.email = "admin@email.com";
  user.password = await bcryptjs.hash("tes123", 10);

  await dataSource.manager.save(user);
}
