/** @format */
import Job from "../models/job.js";
import mongoose from "mongoose";
// create job (only employer or admin)
export const createJob = async (req, res) => {
    try {
        const user = req.user;
        if (!user || (user.role !== "employer" && user.role !== "admin")) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        const { title, position, company, city, jobType, location, salary, jobSummary, responsibilities, details, } = req.body;
        // Validate required fields
        if (!title ||
            !position ||
            !company ||
            !city ||
            !jobType ||
            !location ||
            !salary) {
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
    }
    catch (error) {
        res.status(500).json({ message: "Error creating job", error });
    }
};
export const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find().populate("createdBy", "name role");
        res.status(200).json(jobs);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching jobs", error });
    }
};
// Get jobs by employer (employer can see only his own)
export const getMyJobs = async (req, res) => {
    try {
        const user = req.user;
        const jobs = await Job.find({ createdBy: user.id });
        res.status(200).json(jobs);
    }
    catch (error) {
        res
            .status(500)
            .json({ success: false, message: "error fetching your jobs", error });
    }
};
export const getSingleJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }
        res.status(200).json(job);
    }
    catch (error) {
        console.error("Error fetching job!", error);
        res.status(500).json({
            message: "Error fetching job details",
            error: error.message,
        });
    }
};
export const deleteJob = async (req, res) => {
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
    }
    catch (error) {
        res
            .status(500)
            .json({ success: false, message: "Error deleting job", error });
    }
};
export const applyJob = async (req, res) => {
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
    }
    catch (error) {
        res
            .status(500)
            .json({ success: false, message: "Error applying for job", error });
    }
};
//# sourceMappingURL=jobController.js.map