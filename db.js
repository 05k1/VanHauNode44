import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost", // dia chi host cua mysql duoi local
  user: "root", //ten nguoi dung
  password: "123456",
  database: "node44",
  port: 3307,
});

export default pool;
