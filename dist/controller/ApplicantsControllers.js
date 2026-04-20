import JobApplication from "../models/jobApplication.js";
import Job from "../models/job.js";
export const getEmployerApplicants = async (req, res) => {
    try {
        const employerId = req.user?.id;
        const { jobId } = req.params;
        if (!employerId) {
            return res.status(401).json({ success: false, message: "Unauthorized access" });
        }
        const employerJobs = await Job.find({ createdBy: employerId }).select("_id title");
        const jobIds = employerJobs.map(job => job._id.toString());
        const jobTitleMap = Object.fromEntries(employerJobs.map(j => [j._id.toString(), j.title]));
        let query = {};
        if (jobId) {
            query.appId = jobId;
        }
        else {
            query.appId = { $in: jobIds };
        }
        const applications = await JobApplication.find(query).sort({ createdAt: -1 });
        const formattedData = applications.map((app) => {
            const statusMapping = {
                pending: "Applied",
                interviewing: "Interviewing",
                hired: "Offered",
                rejected: "Rejected"
            };
            return {
                _id: app._id,
                name: app.name || "Unknown Applicant",
                email: app.email || "N/A",
                avatar: "",
                jobApplied: jobTitleMap[app.appId.toString()] || "Position Closed",
                stage: statusMapping[app.status] || "Applied",
                appliedDate: new Date(app.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                }),
                rating: 0,
            };
        });
        res.status(200).json({
            success: true,
            data: formattedData,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
//# sourceMappingURL=ApplicantsControllers.js.map