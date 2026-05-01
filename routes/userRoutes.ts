
import express from 'express'
import { register, login } from '../controller/userController.js';
import { checkRole, verifyToken } from '../middleware/token.js';


const router = express.Router();

router.post("/register", register)
router.post("/login", login)


// router.get(
//   "/job-seeker/dashboard", 
//   verifyToken, 
//   checkRole(["job-seeker"]), 
//   getJobSeekerData
// );

export default router;