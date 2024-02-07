import * as express from "express";
import {
  getConstituents,
  addConstituent,
  updateConstituent,
  deleteConstituent,
} from "../controllers";

const router = express.Router();

router.get("/", getConstituents);
router.post("/", addConstituent);
router.patch("/:id", updateConstituent);
router.delete("/:id", deleteConstituent);

export { router as ConstituentRoute };
