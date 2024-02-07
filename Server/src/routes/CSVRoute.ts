import * as express from "express";
import { uploadCSV, downloadCSV } from "../controllers";

const router = express.Router();

router.post("/upload", uploadCSV);
router.get("/download", downloadCSV);

export { router as CSVRoute };
