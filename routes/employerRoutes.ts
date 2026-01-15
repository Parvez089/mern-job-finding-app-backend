/** @format */

import express from "express";
import multer from "multer";
import { verifyToken } from "../middleware/token.ts";
import {
  getEmployerProfile,
  updateEmployerProfile,
} from "../controller/employerController.ts";
import { getHiringTrend } from "../controller/ChartStateController.ts";
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.get("/me", verifyToken, getEmployerProfile as any);

router.patch(
  "/update",
  verifyToken,
  upload.single("file"),
  updateEmployerProfile as any
);
router.get("/hiring-trends", getHiringTrend);
export default router;