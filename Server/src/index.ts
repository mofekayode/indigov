import * as express from "express";
import { Request, Response, NextFunction } from 'express';
import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as pkg from "pg";
import * as dotenv from "dotenv";
import * as jwt from 'jsonwebtoken';
dotenv.config();

const { Client } = pkg;

import { ConstituentRoute, CSVRoute } from "./routes";

const app = express();
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
       res.sendStatus(401); // Stops the middleware execution here
    }else{
        jwt.verify(token, process.env.JWT_SECRET as string, (err) => {
            if (err) {
              res.sendStatus(403); // Stops the middleware execution here
            }
            next(); // Proceed only if there is no error
          });
    }
    
  };
  

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(authenticateToken);
app.use("/constituent", ConstituentRoute);
app.use("/csv", CSVRoute);

app.set("json spaces", 2);

console.log(process.env.DATABASE_NAME);
const connectionString = `postgres://postgres.dmjdsqlkidxrlllqkjdd:${process.env.DATABASE_PASSWORD}@aws-0-us-west-1.pooler.supabase.com:5432/postgres`;

export const db = new Client({
    connectionString: connectionString,
});
// export const db = new Client({
//   user: process.env.DATABASE_NAME,
//   host: process.env.DATABASE_HOST,
//   database: process.env.DATABASE_NAME,
//   password: process.env.DATABASE_PASSWORD,
//   port: process.env.DATABASE_PORT as unknown as number,
// });

db.connect(function (err: Error) {
  if (err) console.log(err)
  console.log("Connected!");
});
let PORT = Number(process.env.PORT) || 9000;
app.listen(PORT, '::', () => console.log('Listening on IPv6 address'));

