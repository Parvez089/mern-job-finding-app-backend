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

// --- Multer instance ---
// const upload = multer({ 
//     storage,
//     limits: { 
//         fileSize: 10 * 1024 * 1024 // Max 10MB file size
//     },
//     // File Filter for security and validation
//     fileFilter: (req, file, cb) => {
//         if (file.mimetype === 'application/pdf' || 
//             file.mimetype === 'application/msword' || 
//             file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
//             cb(null, true);
//         } else {
//             // Use 'null' instead of an Error object to show message in the response
//             return cb(new Error("File type not supported. Only PDF, DOC, and DOCX allowed."));
//         }
//     }
// });
const upload = multer({ storage: multer.memoryStorage() });
// console.log(upload)

// Export the upload middleware
export default upload;