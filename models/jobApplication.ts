import mongoose, { Schema, Document, Types } from "mongoose";
export interface IJobApplication extends Document {
  appId: Types.ObjectId;
  applicantId: Types.ObjectId;
  name: string;
  email?: string;
  resumeUrl?: string;
  experience?: {
    company?: string;
    role?: string;
    duration?: string;
  }[];
  education?: {
    degree?: string;
    institute?: string;
    year?: string;
  }[];
  phone?: string;
  address?: {
    city?: string;
    state?: string;
    zip?: string;
  };
}


const JobApplicationSchema = new Schema<IJobApplication>(
  {
    appId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
    applicantId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    email: { type: String },
    resumeUrl: { type: String },

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
  },
  { timestamps: true }
);

const JobApplication = mongoose.model<IJobApplication>(
  "JobApplication",
  JobApplicationSchema
);

export default JobApplication;




