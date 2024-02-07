"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConstituentRoute = void 0;
const express = require("express");
const controllers_1 = require("../controllers");
const router = express.Router();
exports.ConstituentRoute = router;
router.get("/", controllers_1.getConstituents);
router.post("/", controllers_1.addConstituent);
router.patch("/:id", controllers_1.updateConstituent);
router.delete("/:id", controllers_1.deleteConstituent);
//# sourceMappingURL=ConstituentRoute.js.map