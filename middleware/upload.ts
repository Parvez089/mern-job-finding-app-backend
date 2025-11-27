import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import type { Request } from "express"; 

// FIX: Added explicit '.js' extension for ESM compatibility
import cloudinary from "../config/cloudinary.ts"; 

// --- Cloudinary storage setup ---
const storage = new CloudinaryStorage({
    cloudinary: cloudinary, // Use the configured instance
    
    // Define the upload parameters 
    params: async (req: Request, file: Express.Multer.File) => {
        const fileExtension = file.originalname.split(".").pop();

        return {
            folder: "job-resumes", 
            resource_type: "auto", 
            format: fileExtension as string, 
            // Create a unique public ID
            public_id: `${req.body.applicantId}-${Date.now()}`,
            tags: ['resume', req.body.applicantId],
        };
    },
});


const upload = multer({ storage: multer.memoryStorage() });
console.log(upload)

// Export the upload middleware
export default upload;