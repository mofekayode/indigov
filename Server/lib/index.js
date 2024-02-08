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
        return res.sendStatus(401);
    }
    else {
        jwt.verify(token, process.env.JWT_SECRET, (err) => {
            if (err) {
                return res.sendStatus(403);
            }
            next();
            return;
        });
    }
    return;
};
const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = ['https://indigov-client.vercel.app'];
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        }
        else {
            callback(new Error('CORS policy violation'));
        }
    },
};
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(authenticateToken);
app.use("/constituent", routes_1.ConstituentRoute);
app.use("/csv", routes_1.CSVRoute);
app.set("json spaces", 2);
console.log(process.env.DATABASE_NAME);
const connectionString = `postgres://postgres.dmjdsqlkidxrlllqkjdd:${process.env.DATABASE_PASSWORD}@aws-0-us-west-1.pooler.supabase.com:5432/postgres`;
exports.db = new Client({
    connectionString: connectionString,
});
exports.db.connect(function (err) {
    if (err)
        console.log(err);
    console.log("Connected!");
});
let PORT = Number(process.env.PORT) || 9000;
app.listen(PORT, '::', () => console.log('Listening on IPv6 address'));
//# sourceMappingURL=index.js.map