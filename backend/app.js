const dotenv = require("dotenv");
dotenv.config();
require("./src/database");
const express = require("express");

const cors = require("cors");
const helmet = require("helmet");
const delay = require("express-delay");


const dataRoutes = require("./src/routes/dataRoutes")

const whiteList = ["http://localhost:3001"];

const corsOptions = {
  origin: function (origin, callback) {
    if (whiteList.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

class App {
  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
  }
  middlewares() {
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    this.app.use(helmet());
    this.app.use(delay(2000));
    this.app.use(cors());
  }
  routes() {

    this.app.use("/data/", dataRoutes);
  }
}

module.exports = new App().app;
