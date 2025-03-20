import mysql from "mysql2/promise";

const connection = mysql.createPool({
  host: "localhost:3306",
  user: "root",
  password: process.env.DB_PASSWORD,
  database: "StorageDB",
});

export default connection;
