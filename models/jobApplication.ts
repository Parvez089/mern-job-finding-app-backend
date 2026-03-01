// models/jobApplication.ts
import mongoose, { Schema, Document, Types } from "mongoose";

export interface IExperience {
  company?: string;
  role?: string;
  duration?: string;
}

export interface IEducation {
  degree?: string;
  institute?: string;
  year?: string;
}

export interface IAddress {
  city?: string;
  state?: string;
  zip?: string;
}

export interface IJobApplication extends Document {
  appId: Types.ObjectId;
  applicantId: Types.ObjectId;
  name: string;
  email?: string;
  phone?: string;
  resume?: string;
  status: string;
  experience?: IExperience[];
  education?: IEducation[];
  address?: IAddress;
}

const JobApplicationSchema = new Schema<IJobApplication>(
  {
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
  },

  { timestamps: true },
);

export default mongoose.model<IJobApplication>(
  "JobApplication",
  JobApplicationSchema
);
