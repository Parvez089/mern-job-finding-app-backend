import mongoose, { Schema } from "mongoose";
const JobApplicationSchema = new Schema({
    appId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
    applicantId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    email: { type: String },
    resume: {
        url: String,
        originalName: String,
        fileType: String,
        size: Number,
        data: Buffer, // OPTIONAL: not recommended for large files
    },
    experience: [
        {
            company: String,
            role: String,
            duration: String,
        },
    ],
    education: [
        {
            degree: String,
            institute: String,
            year: String,
        },
    ],
    phone: String,
    address: {
        city: String,
        state: String,
        zip: String,
    },
}, { timestamps: true });
const JobApplication = mongoose.model("JobApplication", JobApplicationSchema);
export default JobApplication;
//# sourceMappingURL=jobApplication.js.map