import type { Request, Response } from "express";
interface RegisterBody {
    name: string;
    email: string;
    password: string;
    role: string;
}
export declare const register: (req: Request<{}, {}, RegisterBody>, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const login: (req: Request<{}, {}, RegisterBody>, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export {};
