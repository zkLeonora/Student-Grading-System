import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "ktfc4321",
  port: 3307,
  database: "manajemen_nilai",
});