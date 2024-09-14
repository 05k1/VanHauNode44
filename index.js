// import express
import express from "express";

// tao doi tuong express
const app = express();

// them middleware de doc data json
app.use(express.json());

// define port cho backend chay
// params1: define port backend
// params 2: callback function

app.get("/", (req, res) => {
  res.send("Hello node44");
});

app.get("/test", (req, res) => {
  res.send("test api");
});

// demo get params tu url
app.post("/users/:id/:Hoten", (req, res) => {
  let params = req.params;
  let { id, Hoten } = params;
  let body = req.body;
  res.send({ id, Hoten });
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
