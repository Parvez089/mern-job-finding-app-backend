import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
// FIX: Added explicit '.js' extension for ESM compatibility
import cloudinary from "../config/cloudinary.js";
// --- Cloudinary storage setup ---
const storage = new CloudinaryStorage({
    cloudinary: cloudinary, // Use the configured instance
    // Define the upload parameters 
    params: async (req, file) => {
        const fileExtension = file.originalname.split(".").pop();
        return {
            folder: "job-resumes",
            resource_type: "auto",
            format: fileExtension,
            // Create a unique public ID
            public_id: `${req.body.applicantId}-${Date.now()}`,
            tags: ['resume', req.body.applicantId],
        };
    },
});
const upload = multer({ storage: multer.memoryStorage() });
console.log(upload);
// Export the upload middleware
export default upload;
//# sourceMappingURL=upload.js.map