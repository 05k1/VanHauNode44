// import express
import express from "express";
// import pool from "./db.js";
// import { OK, INTERNAL_SERVER } from "./const.js";
import rootRoutes from "./src/routes/root.router.js";
import cors from "cors";
import cookieParser from "cookie-parser";

// tao doi tuong express
const app = express();

app.use(
  cors({
    origin: "http://localhost:3000", // cap quyen cho frontend
    credentials: true, // cho phep fe lay cookie va luu vao cookie
  })
);

// them middleware de doc data json
app.use(express.json());
app.use(cookieParser());

// them middleware cors

// import rootRoutes
app.use(rootRoutes);
// define port cho backend chay
// params1: define port backend
// params 2: callback function

app.get("/", (req, res) => {
  res.send("Hello node44");
});

app.get("/test", (req, res) => {
  res.send("test api");
});

app.get("/test", (req, res) => {
  res.send("test api");
});
// get query tu url
app.get("/test-query", (req, res) => {
  let query = req.query;
  res.send(query);
});

// demo get header from request
app.get("/test-header", (req, res) => {
  let headers = req.headers;
  res.send(headers);
});

app.listen(8080, () => {
  console.log("Server running on port 8080");
});
