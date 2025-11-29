
/** @format */

import type { JwtPayload } from "jsonwebtoken";

import type { Request, Response } from "express";


import Job from "../models/job.js";
import mongoose from "mongoose";



interface AuthenticatedRequest extends Request {
  user?: JwtPayload & { id: string; role: string };
}

// create job (only employer or admin)
export const createJob = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user as JwtPayload;
    if (!user || (user.role !== "employer" && user.role !== "admin")) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }


    const {
      title,
      position,
      company,
      city,
      jobType,
      location,
      salary,
      jobSummary,
      responsibilities,
      details,
    } = req.body;

    // Validate required fields
    if (
      !title ||
      !position ||
      !company ||
      !city ||
      !jobType ||
      !location ||
      !salary
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }
    const newJob = await Job.create({
      ...req.body,
      createdBy: new mongoose.Types.ObjectId(user.id),
    });

    res
      .status(201)
      .json({
        success: true,
        message: "Job created successfully",
        job: newJob,
      });
  } catch (error) {
    res.status(500).json({ message: "Error creating job", error });
  }
};

export const getAllJobs = async (req: Request, res: Response) => {
  try {
    const jobs = await Job.find().populate("createdBy", "name role");
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching jobs", error });
  }
};
// Get jobs by employer (employer can see only his own)
export const getMyJobs = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user as JwtPayload;
    const jobs = await Job.find({ createdBy: user.id });
    res.status(200).json(jobs);
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "error fetching your jobs", error });
  }
};

export const getSingleJob = async (req: Request, res: Response) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json(job);
  } catch (error: any) {
    console.error("Error fetching job!", error);
    res.status(500).json({
      message: "Error fetching job details",
      error: error.message,
    });
  }
};


export const updateJob = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user as JwtPayload;
    const jobId = req.params.id;

    // Check access
    if (!user || (user.role !== "employer" && user.role !== "admin")) {
      return res.status(403).json({
        success: false,
        message: "Access denied! Only employer or admin can edit.",
      });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    // Employer can only update his own job
    if (user.role === "employer" && job.createdBy.toString() !== user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to edit this job",
      });
    }

    // Update job
    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      { ...req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Job updated successfully",
      job: updatedJob,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating job",
      error,
    });
  }
};

export const deleteJob = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user;
    const job = await Job.findById(req.params.id);

    if (!job)
      return res.status(404).json({ success: false, message: "Job not found" });

    if (user?.role === "employer" && job.createdBy.toString() === user.id) {
      await job.deleteOne();
      return res
        .status(200)
        .json({
          success: true,
          message: "Job deleted successfuly by employer",
        });
    }
    if (user?.role === "admin") {
      await job.deleteOne();
      return res
        .status(200)
        .json({ success: true, message: "Job deleted successfuly by admin" });
    }

    return res.status(403).json({ success: false, message: "Access denied" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error deleting job", error });
  }
};

export const applyJob = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user;
   
    if (!user || user.role !== "jobseeker") {
      return res
        .status(403)
        .json({ success: false, message: "Only job seekers con apply" });
    }

    const job = await Job.findById(req.params.id);
    if (!job)
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    res
      .status(200)
      .json({ success: true, message: "Job application submitted success" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error applying for job", error });
  }
};


export const increaseJobView = async(req: AuthenticatedRequest, res: Response) =>{
  try{
    const {jobId} = req.params;
    

    await Job.findByIdAndUpdate(jobId, {$inc: {views: 1}});

    res.json({message: "View updated"});
  } catch(err){
    res.status(500).json({error: "Error updating job views"});
  }
}