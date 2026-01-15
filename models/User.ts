
import mongoose from 'mongoose'


const ImageSchema = new mongoose.Schema({
  public_id: { type: String, required: true },
  secure_url: { type: String, required: true },
  folder: { type: String },
  width: Number,
  height: Number,
  format: String,
  resource_type: String,
}, { _id: false })
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "jobseeker", "employer"],
      default: "jobseeker",
    },
    phone: {
      type: String,
    },
    position: {
      type: String,
    },
    companyName: {
      type: String,
    },
    ProfileImage: {
      type: ImageSchema,
      default: null,
    },
  },
  { timestamps: true }
);


const User = mongoose.model("User", userSchema);

export default User;