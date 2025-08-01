const express = require("express");
const mongoose = require("mongoose");
const productRouter = require("./routers/productRouter.js");
const authRouter = require("./routers/authRouter.js");
const brandRouter = require("./routers/brandRouter.js");
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

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/products", productRouter);
app.use("/auth", authRouter);
app.use("/brand", brandRouter);

app.listen(8080, () => {
  console.log("Server has started on port 8080");
  connectToDatabase();
});
