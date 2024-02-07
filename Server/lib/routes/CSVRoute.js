"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CSVRoute = void 0;
const express = require("express");
const controllers_1 = require("../controllers");
const router = express.Router();
exports.CSVRoute = router;
router.post("/upload", controllers_1.uploadCSV);
router.get("/download", controllers_1.downloadCSV);
//# sourceMappingURL=CSVRoute.js.map
