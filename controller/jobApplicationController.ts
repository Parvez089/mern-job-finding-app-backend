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
  const message =
    error instanceof Error ? error.message : "An unknown error occurred";
  console.error("Error:", error);
  if (error instanceof Error && (error as any).name === "ValidationError") {
    return res
      .status(400)
      .json({ message: "Validation failed", details: error.message });
  }
  res.status(statusCode).json({ message: "Server Error: " + message });
};

// Initialize DatauriParser
const parser = new DataURIParser();

// Converts the buffer from multer into a data URI string (e.g., 'data:image/jpeg;base64,...')
const formatBufferToDataUri = (file: Express.Multer.File) => {
  return parser.format(file.originalname, file.buffer);
};
const uploadToCloudinary = (fileBuffer: Buffer): Promise<any> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ resource_type: "auto" }, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      })
      .end(fileBuffer);
  });
};
/**
 * @route POST /api/applications
 * @desc Create a new job application and handle resume upload
 */
export const createApplication = async (req: CustomRequest, res: Response) => {
  let resumeUrl: string | undefined = undefined;

  try {
    // --- FIX 1: Early Validation for Required Body Fields ---
    const {
      appId,
      applicantId,
      name,
      email,
      phone,
      resume,
      experience,
      education,
      address,
    } = req.body;
    // console.log("body",req.body)
    // console.log("file",req.file)
    if (!appId || !applicantId || !name) {
      return res.status(400).json({
        message:
          "Missing required application fields: appId, applicantId, and name are required.",
      });
    }
    // --------------------------------------------------------

    // 1. Handle File Upload if present (uploaded via 'resumeFile' field)
    if (req.file) {
      const dataUri = formatBufferToDataUri(req.file);
      const dataUriContent = dataUri.content;

      if (!dataUriContent) {
        return res
          .status(400)
          .json({ message: "Could not process file content." });
      }

      const uploadResult = await uploadToCloudinary(req.file.buffer);

      const saved = await jobApplication.create({
        appId: appId,
        applicantId: applicantId,
        name: name,
        email: email,
        phone: phone,
        resume: uploadResult?.secure_url,
        experience: experience,
        education: education,
        address: address,
      });

      return res.json({
        message: "Uploaded successfully",
        url: uploadResult?.secure_url,
        saved,
      });
    }
  } catch (error) {
    // If an error still occurs, use the improved error handler
    console.log("improved error", error);
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