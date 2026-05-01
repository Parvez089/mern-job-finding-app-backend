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
        const { title, department, company, location, jobType, salary, description, skills, perks, cultures, experience, responsibilities, education, visibility, } = req.body;
        if (!title || !department || !company || !salary || !jobType || !location) {
            return res
                .status(400)
                .json({ success: false, message: "Missing required fields" });
        }
        const newJob = await Job.create({
            title,
            department,
            company,
            location,
            jobType,
            salary,
            description,
            skills: skills || [],
            perks: perks || [],
            cultures: cultures || [],
            experience: experience,
            responsibilities: responsibilities || "",
            education: education || "",
            visibility: visibility || "public",
            createdBy: user.id,
            status: "published",
        });
        return res.status(201).json({
            success: true,
            message: "Job created successfully",
            job: newJob,
        });
    }
    catch (error) {
        console.error("BACKEND ERROR:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to create job",
            error: error.message,
        });
    }
};
export const getAllJobs = async (req, res) => {
    try {
        const { page, limit, search, city, jobType, experience } = req.query;
        const pageNum = Number(page) || 1;
        const limitNum = Number(limit) || 12;
        const skip = (pageNum - 1) * limitNum;
        let queryObject = {};
        if (search) {
            queryObject.$or = [
                { title: { $regex: search, $options: "i" } },
                { company: { $regex: search, $options: "i" } }
            ];
        }
        if (city) {
            queryObject.city = { $regex: city, $options: "i" };
        }
        if (jobType) {
            queryObject.jobType = jobType;
        }
        if (experience) {
            queryObject.experience = experience;
        }
        const totalJobs = await Job.countDocuments(queryObject);
        const jobs = await Job.find(queryObject)
            .populate("createdBy", "name role")
            .skip(skip)
            .limit(limitNum)
            .sort({ createdAt: -1 });
        const totalPages = Math.ceil(totalJobs / limitNum);
        res.status(200).json({
            jobs,
            pagination: {
                totalJobs,
                totalPages,
                currentPage: page,
                pageSize: limit,
            },
        });
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
export const updateJob = async (req, res) => {
    try {
        const user = req.user;
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
        const updatedJob = await Job.findByIdAndUpdate(jobId, { ...req.body }, { new: true, runValidators: true });
        res.status(200).json({
            success: true,
            message: "Job updated successfully",
            job: updatedJob,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating job",
            error,
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
export const increaseJobView = async (req, res) => {
    try {
        const { jobId } = req.params;
        await Job.findByIdAndUpdate(jobId, { $inc: { views: 1 } });
        res.json({ message: "View updated" });
    }
    catch (err) {
        res.status(500).json({ error: "Error updating job views" });
    }
};
// export const getRecentJobs = async (req: any, res: Response) =>{
//   try{
//     const employerId = req.user.id;
//     const jobs = (await Job.find({createdBy: employerId})).sort({createdAt: -1}).limit(3).lean<IJob>();
//     const formattedJobs = jobs.map(job => ({
//       id: job._id,
//       title: job.title,
//       company: job.location,
//       department: job.department,
//       datePosted: job.createdAt,
//       applicanjs: job.applicantCount || 0,
//       status: job.status,
//     }))
//   } catch (error){
//     res.status(500).json({message: "Error fetching recent jobs"})
//   }
// }
//# sourceMappingURL=jobController.js.map