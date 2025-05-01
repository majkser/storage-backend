import mysql from "mysql2/promise";

const dbConnection = mysql.createPool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT as string),
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default dbConnection;
