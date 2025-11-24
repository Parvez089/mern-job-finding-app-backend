import { Router } from "express";
import multer from "multer"; // Middleware for handling file uploads
import { createApplication,  } from "../controller/jobApplicationController.ts";


const router = Router();

// Configure Multer to store the incoming file in memory (Buffer).
// This is the cleanest way to handle uploads before sending them to Cloudinary.
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { 
        fileSize: 10 * 1024 * 1024 // Limit file size to 10MB
    },
});

// Base route: /api/applications

// POST: Use upload.single('resumeFile') middleware. 
// 'resumeFile' MUST match the field name in the client's form data.
router.route("/")
    // .get(getAllApplications)
    .post(upload.single('resumeFile'), createApplication); 

// ID-based routes (GET, PUT, DELETE)
// router.route("/:id")
//     .get(getApplicationById)
//     .put(updateApplication)
//     .delete(deleteApplication);

export default router;