import "reflect-metadata"
import { DataSource } from "typeorm"
import { Division } from "./modules/division/division.entity"

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "",
    database: "tms",
    synchronize: true,
    logging: false,
    entities: [
        Division
    ],
    migrations: [],
    subscribers: [],
})
