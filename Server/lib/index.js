"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const pkg = require("pg");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
dotenv.config();
const { Client } = pkg;
const routes_1 = require("./routes");
const app = express();
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        return res.sendStatus(401); // Stops the middleware execution here
    }
    jwt.verify(token, process.env.JWT_SECRET, (err) => {
        if (err) {
            return res.sendStatus(403); // Stops the middleware execution here
        }
        next(); // Proceed only if there is no error
    });
};
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(authenticateToken);
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
    if (err)
        throw err;
    console.log("Connected!");
});
app.listen(process.env.PORT, () => {
    console.log("backend running");
});
//# sourceMappingURL=index.js.map