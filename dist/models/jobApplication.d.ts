import mongoose, { Document, Types } from "mongoose";
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
        data?: Buffer;
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
declare const JobApplication: mongoose.Model<IJobApplication, {}, {}, {}, mongoose.Document<unknown, {}, IJobApplication, {}, {}> & IJobApplication & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default JobApplication;
