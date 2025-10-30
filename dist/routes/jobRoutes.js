import { applyJob, deleteJob, getMyJobs, getSingleJob } from './../controller/jobController.js';
import express from "express";
import { checkRole, verifyToken } from "../middleware/token.js";
import { createJob, getAllJobs } from "../controller/jobController.js";
const router = express.Router();
router.post("/", verifyToken, checkRole(["employer", "admin"]), createJob);
router.get("/", getAllJobs);
router.get("/my-jobs", verifyToken, checkRole(["employer"]), getMyJobs);
router.get("/:id", getSingleJob);
router.delete("/:id", verifyToken, checkRole(["employer", "admin"]), deleteJob);
router.post("/:id/apply", verifyToken, checkRole(["jobseeker"]), applyJob);
export default router;
//# sourceMappingURL=jobRoutes.js.map