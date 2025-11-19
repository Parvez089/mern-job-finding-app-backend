import mongoose, { Schema, Document, Types } from "mongoose";
export interface IJobApplication extends Document {
  appId: Types.ObjectId;
  applicantId: Types.ObjectId;
  name: string;
  email?: string;
    resume?: {
    url?: string;
    originalName?: string;
    fileType?: string;
    size?: number;
    data?: Buffer; // optional: store file in DB
  };
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
  },
  { timestamps: true }
);

const JobApplication = mongoose.model<IJobApplication>(
  "JobApplication",
  JobApplicationSchema
);

export default JobApplication;




