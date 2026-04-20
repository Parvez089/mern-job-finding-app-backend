import express from "express";
import { verifyToken } from "../middleware/token.js";
import { getEmployerApplicants } from "../controller/ApplicantsControllers.js";
const router = express.Router();
router.get("/employer/applicants", verifyToken, getEmployerApplicants);
router.get("/job/:jobId", verifyToken, getEmployerApplicants);
export default router;
//# sourceMappingURL=ApplicantsRoutes.js.map