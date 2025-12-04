/** @format */

import express from "express";
import multer from "multer";
import { verifyToken } from "../middleware/token.ts";
import { getEmployerProfile } from "../controller/employerController.ts"
const router = express.Router();

const upload = multer({storage: multer.memoryStorage()});

router.get("/me", verifyToken, getEmployerProfile as any);


export default router;