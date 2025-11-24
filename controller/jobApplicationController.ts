import type { Request, Response } from "express";
// Assuming jobApplication.model is the path to your schema file

// CORRECTED: Used datauri-parser (with hyphen)
import cloudinary from "../config/cloudinary.ts";
import DataURIParser from "datauri/parser.js";
import type { IJobApplication } from "../models/jobApplication.ts";
import jobApplication from "../models/jobApplication.ts";

// Extend Request type to include the file property added by Multer
interface CustomRequest extends Request {
    file?: Express.Multer.File;
}

// Helper function for error handling
const handleError = (res: Response, error: unknown, statusCode = 500) => {
    const message = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Error:", message);
    if (error instanceof Error && (error as any).name === 'ValidationError') {
        return res.status(400).json({ message: "Validation failed", details: error.message });
    }
    res.status(statusCode).json({ message: "Server Error: " + message });
};

// Initialize DatauriParser
const parser = new DataURIParser();

// Converts the buffer from multer into a data URI string (e.g., 'data:image/jpeg;base64,...')
const formatBufferToDataUri = (file: Express.Multer.File) => {
    return parser.format(file.originalname, file.buffer);
};

/**
 * @route POST /api/applications
 * @desc Create a new job application and handle resume upload
 */
export const createApplication = async (req: CustomRequest, res: Response): Promise<void> => {
    let resumeUrl: string | undefined = undefined;

    try {
        // 1. Handle File Upload if present (uploaded via 'resumeFile' field)
        if (req.file) {
            const dataUri = formatBufferToDataUri(req.file);
            const dataUriContent = dataUri.content;

            if (!dataUriContent) {
                 res.status(400).json({ message: "Could not process file content." });
                 return;
            }

            // Upload the Data URI to Cloudinary
            const uploadResult = await cloudinary.uploader.upload(dataUriContent, {
                folder: "job-applications-resumes", // Custom folder for organization
                resource_type: "auto", // Automatically detect file type (pdf, docx, image, etc.)
                public_id: `${req.body.applicantId}-${Date.now()}`, // Unique public ID
                // Optional: set allowed formats for better security/control
                allowed_formats: ['pdf', 'doc', 'docx', 'jpg', 'png'],
            });
            
            resumeUrl = uploadResult.secure_url;
            console.log(`Resume uploaded successfully: ${resumeUrl}`);
        }

        // 2. Create the Mongoose Document
        const applicationData: Partial<IJobApplication> = {
            ...req.body,
            resume: resumeUrl, // Store the Cloudinary URL
        };
        
        // Mongoose validation will ensure appId, applicantId, and name are present
        const newApplication = new jobApplication(applicationData);
        const savedApplication = await newApplication.save();

        res.status(201).json({ 
            message: "Application created successfully",
            data: savedApplication 
        });

    } catch (error) {
        handleError(res, error, 400);
    }
};

/**
 * @route GET /api/applications
 * @desc Get all job applications
 */
// export const getAllApplications = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const applications = await jobApplication.find({}).sort({ createdAt: -1 }); // Sort by newest first
//         res.status(200).json(applications);
//     } catch (error) {
//         handleError(res, error);
//     }
// };

/**
 * @route GET /api/applications/:id
 * @desc Get a single job application by ID
 */
// export const getApplicationById = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const application = await JobApplication.findById(req.params.id);

//         if (!application) {
//             res.status(404).json({ message: "Job Application not found" });
//             return;
//         }

//         res.status(200).json(application);
//     } catch (error) {
//         handleError(res, error);
//     }
// };

/**
 * @route PUT /api/applications/:id
 * @desc Update a job application by ID (Does not handle file updates in this version)
 */
// export const updateApplication = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const updatedApplication = await JobApplication.findByIdAndUpdate(
//             req.params.id,
//             req.body,
//             { new: true, runValidators: true } 
//         );

//         if (!updatedApplication) {
//             res.status(404).json({ message: "Job Application not found" });
//             return;
//         }

//         res.status(200).json(updatedApplication);
//     } catch (error) {
//         handleError(res, error, 400);
//     }
// };

/**
 * @route DELETE /api/applications/:id
 * @desc Delete a job application by ID
 */
// export const deleteApplication = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const application = await JobApplication.findById(req.params.id);

//         if (!application) {
//             res.status(404).json({ message: "Job Application not found" });
//             return;
//         }
        
//         // Optional: If a resume exists, delete it from Cloudinary for cleanup
//         if (application.resume) {
//             // Cloudinary public ID is derived from the URL (not implemented here, requires URL parsing)
//             console.log(`Note: Resume file exists at ${application.resume}. Manual Cloudinary deletion may be required.`);
//         }

//         await JobApplication.deleteOne({ _id: req.params.id });

//         res.status(200).json({ message: "Job Application successfully deleted" });
//     } catch (error) {
//         handleError(res, error);
//     }
// };