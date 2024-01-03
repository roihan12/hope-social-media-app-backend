import mysql from "mysql";
import { DB_NAME, DB_PASSWORD, DB_USER } from "../constans.js";

console.log(DB_NAME, DB_PASSWORD, DB_USER);

export const db = mysql.createConnection({
  host: "localhost",
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
});
