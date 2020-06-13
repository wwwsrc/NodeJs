const express = require("express");
const mongoose = require("mongoose");

const cors = require("cors");
const morgan = require("morgan");
const usersRouter = require("./users/user.router");
//hw4
const cookieParser = require("cookie-parser");
import { authRouter } from "./auth/auth.router";

module.exports = class Server {
  constructor() {
    this.app = null;
  }
  async start() {
    this.initServer();
    this.initMiddleware();
    await this.initDatabase();
    this.initRoutes();
    this.initErrorHandling();
    this.startListening();
  }

  initServer() {
    this.app = express();
  }
  initMiddleware() {
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(morgan("combined"));
    //hw3
    this.app.use(cookieParser());
  }
  initRoutes() {
    this.app.use("/api", usersRouter);
    this.app.use("/auth", authRouter);
    this.app.use("/users", authRouter);
    this.app.use("/public", express.static("public"));
  }

  async initDatabase() {
    mongoose.set("useCreateIndex", true);
    mongoose.set("useFindAndModify", false);
    mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: true,
    });
    const db = mongoose.connection;

    db.on("error", (err) => {
      console.log("error:", err);
      process.exit(1);
    });
    db.once("open", async () => {
      console.log("Database connection successful");
    });
  }

  initErrorHandling() {
    this.app.use((err, req, res, next) => {
      return res.status(err.status).send(err.message);
    });
  }

  startListening() {
    const PORT = process.env.PORT;
    console.log(process.env.PORT);
    this.app.listen(PORT, () => {
      console.log("Server APP listening on port", PORT);
    });
  }
};
