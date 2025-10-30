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
    description?: string | null;
    rate?: string | null;
    jobSummary?: string | null;
    responsibilities?: string | null;
    qualifications?: string | null;
    details?: string | null;
} & mongoose.DefaultTimestampProps, {}, {}, {}, mongoose.Document<unknown, {}, {
    title: string;
    position: string;
    company: string;
    city: string;
    jobType: string;
    location: string;
    salary: string;
    createdBy: mongoose.Types.ObjectId;
    description?: string | null;
    rate?: string | null;
    jobSummary?: string | null;
    responsibilities?: string | null;
    qualifications?: string | null;
    details?: string | null;
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
    description?: string | null;
    rate?: string | null;
    jobSummary?: string | null;
    responsibilities?: string | null;
    qualifications?: string | null;
    details?: string | null;
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
    description?: string | null;
    rate?: string | null;
    jobSummary?: string | null;
    responsibilities?: string | null;
    qualifications?: string | null;
    details?: string | null;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    title: string;
    position: string;
    company: string;
    city: string;
    jobType: string;
    location: string;
    salary: string;
    createdBy: mongoose.Types.ObjectId;
    description?: string | null;
    rate?: string | null;
    jobSummary?: string | null;
    responsibilities?: string | null;
    qualifications?: string | null;
    details?: string | null;
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
    description?: string | null;
    rate?: string | null;
    jobSummary?: string | null;
    responsibilities?: string | null;
    qualifications?: string | null;
    details?: string | null;
} & mongoose.DefaultTimestampProps> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default Job;
//# sourceMappingURL=job.d.ts.map