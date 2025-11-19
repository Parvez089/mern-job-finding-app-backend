/** @format */
import type { JwtPayload } from "jsonwebtoken";
import type { Request, Response } from "express";
interface AuthenticatedRequest extends Request {
    user?: JwtPayload & {
        id: string;
        role: string;
    };
}
export declare const createJob: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getAllJobs: (req: Request, res: Response) => Promise<void>;
export declare const getMyJobs: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const getSingleJob: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteJob: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const applyJob: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export {};
