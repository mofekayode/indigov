import * as express from "express";
import { uploadCSV2, downloadCSV } from "../controllers";
import * as multer from 'multer';

const upload = multer({ dest: 'uploads/' });
const router = express.Router();

router.post("/upload",upload.single('file'), uploadCSV2);
router.get("/download", downloadCSV);

export { router as CSVRoute };
