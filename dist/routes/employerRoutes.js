/** @format */
import express from "express";
import multer from "multer";
import { verifyToken } from "../middleware/token.js";
import { getEmployerProfile, updateEmployerProfile, } from "../controller/employerController.js";
import { getHiringTrend } from "../controller/ChartStateController.js";
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
router.get("/me", verifyToken, getEmployerProfile);
router.patch("/update", verifyToken, upload.single("file"), updateEmployerProfile);
router.get("/hiring-trends", getHiringTrend);
export default router;
//# sourceMappingURL=employerRoutes.js.map