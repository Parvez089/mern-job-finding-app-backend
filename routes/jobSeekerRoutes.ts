import express from 'express'
import userProfile from '../controller/jobSeekerController.js';

const router = express.Router();

router.get('/:uderId', userProfile)

export default router;