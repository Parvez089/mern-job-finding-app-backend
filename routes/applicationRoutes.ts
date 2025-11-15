import express from "express"
import { verifyToken } from "../middleware/token.js";
import { createJobApplication, deleteApplication, getAllApplications, getApplicationById } from "../models/jobApplicationController.js";

const router = express.Router();



router.post("/",verifyToken, createJobApplication)
router.get("/:id", verifyToken, getApplicationById)
router.get("/:id", verifyToken, getAllApplications)
router.delete("/:id", verifyToken, deleteApplication)

export default router;