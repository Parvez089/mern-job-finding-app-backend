import mongoose from "mongoose";
const JobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    position: {
        type: String,
        required: true,
    },
    company: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    jobType: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    rate: {
        type: String,
    },
    salary: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    jobSummary: {
        type: String,
    },
    responsibilities: {
        type: String,
    },
    qualifications: {
        type: String,
    },
    details: {
        type: String,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, { timestamps: true });
const Job = mongoose.model("Job", JobSchema);
export default Job;
//# sourceMappingURL=job.js.map