
/** @format */

import type { Request, Response } from "express";
import type { JwtPayload } from "jsonwebtoken";
import cloudinary from "../config/cloudinary.ts";
import mongoose from "mongoose";
import JobApplication from "../models/jobApplication.ts";

interface AuthenticatedRequest extends Request {
  user?: JwtPayload & { id: string; role: string };
  file?: Express.Multer.File;
}

//------------------Create job application

export const createJobApplication = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const user = req.user;
    if (!user)
      return res.status(403).json({ success: false, message: "Unauthorize" });

    const {
      appId,
      name,
      email,
      address,
      experience,
      education,
      skills,
      phone,
    } = req.body;

    if (!appId || !name) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Missing required fills (appId or name",
        });
    }

    let resumeData: any = undefined;
    if (req.file && req.file.buffer) {
      const uploadResult = await new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "resumes", resource_type: "auto" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file?.buffer);
      });

      resumeData = {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        originalName: req.file.originalname,
        fileType: req.file.mimetype,
        size: req.file.size,
      };
    }

    const newApplication = new JobApplication({
      appId: mongoose.Types.ObjectId.isValid(appId)
        ? new mongoose.Types.ObjectId(appId)
        : appId,
      applicantId: new mongoose.Types.ObjectId(user.id),
      name,
      email,
      address,
      experience,
      education,
      skills,
      phone,
      resume: resumeData,
    });

    const saved = await newApplication.save();
    res
      .status(201)
      .json({
        success: true,
        message: "Application submitted successfully",
        data: saved,
      });
  } catch (error: any) {
    console.error("create job application error: ", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Error submitting application",
        error: error.message,
      });
  }
};


// __________________________Get Application By Id_________________

export const getApplicationById = async (req: Request, res: Response)=>{
    try{
        const appId = req.params.id;
        if(!appId || !mongoose.Types.ObjectId.isValid(appId)){
            return res.status(400).json({success: false, message: "Valid application ID is required"});
        }

        const application = await JobApplication.findById(appId).populate("appId").populate("ApplicantId").exec();

        if(!application) return res.status(404).json({success: false, message: "Application not found"});

        res.status(200).json({success: true, data:application});
    } catch(error: any){
        console.error("get application by id error: ", error);
        res.status(500).json({success: false, message: "Error fetching application", error: error.message})
    }
}