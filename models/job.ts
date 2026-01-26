import mongoose  from "mongoose";

const JobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      require: true,
    },

    company: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    isRemote: {
      type: Boolean,
      default: false,
    },

    jobType: {
      type: String,
      required: true,
    },

    salary: {
      type: String,
      required: true,
    },

    //  Description & Responsibilities
    description: {
      type: String,
    },
    responsibilities: {
      type: String,
    },

    // Requirements Section

    skills: [{ type: String }],
    experienceLevel: { type: String },
    education: { type: String },

    // Team & Culture Section
    workCulture: [{ type: String }],
    perks: [{ type: String }],
    teamIntroduction: { type: String },

    // Status & Visibility
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    externalPosting: {
      type: Boolean,
    },

    views: { type: Number, default: 0 },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);


const Job = mongoose.model("Job", JobSchema);

export default Job;