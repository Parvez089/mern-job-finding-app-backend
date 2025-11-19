import mongoose from "mongoose";
declare const Job: mongoose.Model<{
    title: string;
    position: string;
    company: string;
    city: string;
    jobType: string;
    location: string;
    salary: string;
    createdBy: mongoose.Types.ObjectId;
    description?: string | null | undefined;
    rate?: string | null | undefined;
    jobSummary?: string | null | undefined;
    responsibilities?: string | null | undefined;
    qualifications?: string | null | undefined;
    details?: string | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {}, {}, mongoose.Document<unknown, {}, {
    title: string;
    position: string;
    company: string;
    city: string;
    jobType: string;
    location: string;
    salary: string;
    createdBy: mongoose.Types.ObjectId;
    description?: string | null | undefined;
    rate?: string | null | undefined;
    jobSummary?: string | null | undefined;
    responsibilities?: string | null | undefined;
    qualifications?: string | null | undefined;
    details?: string | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    title: string;
    position: string;
    company: string;
    city: string;
    jobType: string;
    location: string;
    salary: string;
    createdBy: mongoose.Types.ObjectId;
    description?: string | null | undefined;
    rate?: string | null | undefined;
    jobSummary?: string | null | undefined;
    responsibilities?: string | null | undefined;
    qualifications?: string | null | undefined;
    details?: string | null | undefined;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    title: string;
    position: string;
    company: string;
    city: string;
    jobType: string;
    location: string;
    salary: string;
    createdBy: mongoose.Types.ObjectId;
    description?: string | null | undefined;
    rate?: string | null | undefined;
    jobSummary?: string | null | undefined;
    responsibilities?: string | null | undefined;
    qualifications?: string | null | undefined;
    details?: string | null | undefined;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    title: string;
    position: string;
    company: string;
    city: string;
    jobType: string;
    location: string;
    salary: string;
    createdBy: mongoose.Types.ObjectId;
    description?: string | null | undefined;
    rate?: string | null | undefined;
    jobSummary?: string | null | undefined;
    responsibilities?: string | null | undefined;
    qualifications?: string | null | undefined;
    details?: string | null | undefined;
} & mongoose.DefaultTimestampProps>, {}, mongoose.ResolveSchemaOptions<{
    timestamps: true;
}>> & mongoose.FlatRecord<{
    title: string;
    position: string;
    company: string;
    city: string;
    jobType: string;
    location: string;
    salary: string;
    createdBy: mongoose.Types.ObjectId;
    description?: string | null | undefined;
    rate?: string | null | undefined;
    jobSummary?: string | null | undefined;
    responsibilities?: string | null | undefined;
    qualifications?: string | null | undefined;
    details?: string | null | undefined;
} & mongoose.DefaultTimestampProps> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default Job;
