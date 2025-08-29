const express = require("express");
const mongoose = require("mongoose");
const { createServer } = require("http");
const { Server } = require("socket.io");
const productRouter = require("./routers/productRouter.js");
const authRouter = require("./routers/authRouter.js");
const brandRouter = require("./routers/brandRouter.js");
const orderRouter = require("./routers/orderRouter.js");
const userRouter = require("./routers/userRouter.js");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log(`connected to database`);
  } catch (error) {
    console.log("Error connecting to the database" + error);
  }
};
const app = express();

const httpServer = createServer(app);
const ioServer = new Server(httpServer);

app.set("ioServer", ioServer);

app.use(express.json());

app.use((req, res, next) => {
  req.socket = ioServer;
  next();
});

// app.use(express.urlencoded({ extended: true }));
ioServer.use((socket, next) => {
  const auth = socket.handshake.headers.authorization;
  const [type, token] = auth.split(" ");
  if (type === "Bearer") {
    const value = jwt.verify(token, process.env.JWT_SECRET);
    socket.handshake.auth.decoded = value;
    next();
  } else {
    socket.send("You are not authorized");
  }
});

app.get("/ping", (req, res) => {
  req.socket.to(req.body.to).emit("send-message", {
    message: req.body.message,
  });
  res.send("pong");
  console.log("pong");
});

app.use("/products", productRouter);
app.use("/auth", authRouter);
app.use("/brand", brandRouter);
app.use("/order", orderRouter);
app.use("/profile", userRouter);

ioServer.on("connection", (socket) => {
  const user = socket.handshake.auth.decoded;

  // Each user joins a room based on their email
  socket.join(user.ownerId);
  console.log("Welcome:::", user.ownerId);

  // Send message event
  socket.on("send-message", (payload) => {
    // Send message to the target user's room
    ioServer.to(payload.to).emit("send-message", {
      to: user.ownerId,
      message: payload.message,
    });
  });

  socket.on("disconnect", () => {
    socket.leave(user.ownerId);
    console.log("Goodbye:::", user.ownerId);
  });
});

httpServer.listen(8080, () => {
  console.log("Server is running on port 3000");
  connectToDatabase();
});

// app.listen(8080, () => {
//   console.log("Server has started on port 8080");
//   connectToDatabase();
// });
