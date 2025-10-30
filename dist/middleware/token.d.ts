import type { Request, Response, NextFunction } from "express";
import type { JwtPayload } from "jsonwebtoken";
interface AuthenticatedRequest extends Request {
    user?: string | JwtPayload;
}
export declare const verifyToken: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const checkRole: (roles: string[]) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export {};
//# sourceMappingURL=token.d.ts.map