import { applyJob, deleteJob, getMyJobs, getSingleJob, increaseJobView, updateJob } from './../controller/jobController.js';
import express from "express"
import { checkRole, verifyToken } from "../middleware/token.js";
import { createJob, getAllJobs } from "../controller/jobController.js";

const router = express.Router();


// Post job and see all job
router.post("/", verifyToken, checkRole(["employer", "admin"]),createJob)
router.get("/", getAllJobs)

// Find specific user job
router.get("/my-jobs", verifyToken, checkRole(["employer"]), getMyJobs)

// Find specific job
router.get("/:id",getSingleJob)

// update and delete job
router.put("/:id", verifyToken, updateJob);
router.delete("/:id", verifyToken, checkRole(["employer", "admin"]), deleteJob)

// apply jobs
router.post("/:id/apply", verifyToken, checkRole(["jobseeker"]), applyJob)

// Increase job view
router.get("/job/view/:jobId", verifyToken, increaseJobView);

export default router;