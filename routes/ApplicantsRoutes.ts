import  express  from "express"
import { verifyToken } from "../middleware/token.ts";
import { getEmployerApplicants } from "../controller/ApplicantsControllers.ts";

const router = express.Router()


router.get("/employer/applicants", verifyToken, getEmployerApplicants);
router.get("/job/:jobId", verifyToken, getEmployerApplicants)

export default router;