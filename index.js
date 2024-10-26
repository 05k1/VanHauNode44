// import express
import express from "express";
// import pool from "./db.js";
// import { OK, INTERNAL_SERVER } from "./const.js";
import rootRoutes from "./src/routes/root.router.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import { createServer } from "http";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// tao doi tuong express
const app = express();

// define middleware de public  folder public
app.use(express.static("."));

app.use(
  cors({
    origin: "http://localhost:3000", // cap quyen cho frontend
    credentials: true, // cho phep fe lay cookie va luu vao cookie
  })
);

// tao http server
const server = createServer(app);

// tao socketIO server
// io: obj cua socket server
// socket: obj cua socket client
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// lang nghe event ket noi tu client (FE) qua socketIO
// on nhan event
// emit gui event
// co 2 params
// params1 event type
// param2 function

let number = 0;

io.on("connection", (socket) => {
  console.log(socket.id);
  socket.on("send-click", () => {
    console.log("FE send click");
    number += 1;
    // server ban event cho tat ca client
    io.emit("send-new-number", number);
  });
  socket.on("reduce-number", () => {
    number -= 1;
    // server ban event cho tat ca client
    io.emit("send-new-number", number);
  });

  // nhan event send message
  socket.on("send-mess", async ({ user_id, content }) => {
    let newChat = {
      user_id,
      content,
      date: new Date(),
    };
    // luu chat vao db
    await prisma.chat.create({
      data: newChat,
    });
    // server ban event cho tat ca client
    io.emit("sv-send-mess", { user_id, content });
  });
});

// BE nhan event tu fe client gui ve

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

server.listen(8080, () => {
  console.log("Server running on port 8080");
});
