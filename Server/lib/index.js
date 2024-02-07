"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const pkg = require("pg");
const dotenv = require("dotenv");
dotenv.config();
const { Client } = pkg;
const routes_1 = require("./routes");
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/constituent", routes_1.ConstituentRoute);
app.use("/csv", routes_1.CSVRoute);
app.set("json spaces", 2);
console.log(process.env.DATABASE_NAME);
exports.db = new Client({
  user: process.env.DATABASE_NAME,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT,
});
exports.db.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});
app.listen(process.env.PORT, () => {
  console.log("backend running");
});
//# sourceMappingURL=index.js.map
