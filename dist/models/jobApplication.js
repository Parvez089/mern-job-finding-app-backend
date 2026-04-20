// models/jobApplication.ts
import mongoose, { Schema, Document, Types } from "mongoose";
const JobApplicationSchema = new Schema({
    appId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
    applicantId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    status: {
        type: String,
        enum: ["pending", "interviewing", "hired", "rejected"],
        default: "pending",
    },
    email: String,
    phone: String,
    resume: String,
    experience: { type: [Schema.Types.Mixed], default: [] },
    education: { type: [Schema.Types.Mixed], default: [] },
    address: { type: Schema.Types.Mixed, default: {} },
}, { timestamps: true });
export default mongoose.model("JobApplication", JobApplicationSchema);
//# sourceMappingURL=jobApplication.js.map