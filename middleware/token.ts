import type { Request, Response, NextFunction } from "express";
import  type { JwtPayload } from "jsonwebtoken";
import  jwt  from "jsonwebtoken";

interface AuthenticatedRequest extends Request{
  user?: string| JwtPayload;
}

export const verifyToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided." });
    }
    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error: any) {
    console.log("JWT Error:", error.message);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};


export const checkRole = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const user = req.user as JwtPayload | undefined;
    const userRole = user?.role;

    if (!userRole || !roles.includes(userRole)) {
      return res.status(403).json({ message: "Access denied. Insufficient permissions." });
    }

    next();
  };
};