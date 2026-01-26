// models/jobApplication.ts
import mongoose, { Schema, Document } from "mongoose";

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
  appId: string;
  applicantId: string;
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
    appId: { type: String, required: true },
    applicantId: { type: String, required: true },
    name: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "interviewing", "hired", "rejected"],
      default: "pending",
    },
    email: String,
    phone: String,
    resume: String,

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

    address: {
      city: String,
      state: String,
      zip: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IJobApplication>(
  "JobApplication",
  JobApplicationSchema
);
