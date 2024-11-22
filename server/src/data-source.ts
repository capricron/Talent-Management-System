import "reflect-metadata";
import { DataSource } from "typeorm";
import { Division } from "./modules/division/division.entity";
import { User } from "./modules/auth/user.entity";
import { runSeeder } from "./seeders";
import { Job } from "./modules/job/job.entity";
import { Candidate } from "./modules/candidate/candidate.entity";

const seedData = false;

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "",
  database: "tms",
  synchronize: true,
  dropSchema: seedData,
  logging: false,
  entities: [
    User, 
    Division, 
    Job, 
    Candidate
  ],
  migrations: [],
  subscribers: [],
});

async function initializeDatabaseUntilSuccess() {
  let attempt = 0;
  let success = false;

  while (!success) {
    try {
      console.log(`Attempt ${attempt + 1} to initialize database...`);

      await AppDataSource.initialize();
      await AppDataSource.dropDatabase();
      await AppDataSource.synchronize();
      await runSeeder(AppDataSource);

      success = true; // Jika berhasil, keluar dari loop
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        console.log(`Duplicate entry error on attempt ${attempt + 1}, retrying...`);
      } else {
        console.log(`Unexpected error on attempt ${attempt + 1}:`, error);
        break; // Jika error bukan duplicate, keluar dari loop
      }
      attempt++;
    } finally {
      // await AppDataSource.close();
    }
  }

  if (!success) {
    console.log("Failed to initialize database due to unexpected error.");
  } else {
    console.log("Database initialized successfully.");
  }
}

// Panggil fungsi tanpa batasan retries
if (seedData) {
  initializeDatabaseUntilSuccess();
}
