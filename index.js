const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const cookieparser = require("cookie-parser");

const PORT = process.env.PORT || 8080;

const router = require("./routes");
const { app, server } = require("./socket/index");

// const app = express();

console.log("frontend", process.env.FRONTEND_URL);

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true,
  })
);
app.use(cookieparser());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "server started on 8080",
  });
});

app.use("/api", router);

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log("server running");
  });
});
