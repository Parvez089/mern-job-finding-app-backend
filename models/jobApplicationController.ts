import type { Request, Response } from "express";
import mongoose from "mongoose";
import  JobApplication from "../models/jobApplication.js";
import type { IJobApplication} from "../models/jobApplication.js";
import type { JwtPayload } from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
  user?: JwtPayload & { id: string; role: string };
}

// Create Job Application
export const createJobApplication = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) return res.status(403).json({ success: false, message: "Unauthorized" });

    const { appId, name, resumeUrl, email, gender, address, experience, education, skills } = req.body;

    if (!appId || !name || !resumeUrl)
      return res.status(400).json({ success: false, message: "Missing required fields" });

    const newApplication = new JobApplication({
      appId: new mongoose.Types.ObjectId(appId),
      applicantId: new mongoose.Types.ObjectId(user.id),
      name,
      resumeUrl,
      email,
      gender,
      address,
      experience,
      education,
      skills,
    });

    const saved = await newApplication.save();
    res.status(201).json({ success: true, message: "Application submitted successfully", data: saved });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error submitting application", error: error.message });
  }
};

// Get Application By ID
export const getApplicationById = async (req: Request, res: Response) => {
  try {
    const appId = req.params.id;

    if (!appId || !mongoose.Types.ObjectId.isValid(appId))
      return res.status(400).json({ success: false, message: "Valid application ID is required" });

    const application = await JobApplication.findById(appId)
      .populate("appId")
      .populate("applicantId")
      .exec();

    if (!application) return res.status(404).json({ success: false, message: "Application not found" });

    res.status(200).json({ success: true, data: application });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error fetching application", error: error.message });
  }
};

// Get All Applications
export const getAllApplications = async (req: Request, res: Response) => {
  try {
    const applications: IJobApplication[] = await JobApplication.find()
      .populate("appId")
      .populate("applicantId")
      .exec();
    res.status(200).json({ success: true, data: applications });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error fetching applications", error: error.message });
  }
};

// Delete Application
export const deleteApplication = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user;
    const appId = req.params.id;

    if (!appId || !mongoose.Types.ObjectId.isValid(appId))
      return res.status(400).json({ success: false, message: "Valid application ID is required" });

    const application = await JobApplication.findById(appId);

    if (!application) return res.status(404).json({ success: false, message: "Application not found" });

    if (user?.role === "admin" || application.applicantId.toString() === user?.id) {
      await application.deleteOne();
      return res.status(200).json({ success: true, message: "Application deleted successfully" });
    }

    res.status(403).json({ success: false, message: "Access denied" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error deleting application", error: error.message });
  }
};


