

import type {Request, Response,NextFunction } from 'express';

export const authorizeDashboard = (requiredRole: 'admin' | 'employer' | 'job-seeker') =>{
    return (req: any, res: Response, next: NextFunction)=>{
    // 1. Check if user is logged in 
    if(!req.user){
  return res.status(401).json({message: "Not authenticated"});
    }

    if(req.user.role !== requiredRole){
        return res.status(403).json({
            message: `Access Denied. This dashboard is for ${requiredRole}s only.`
        });
    }

    next();
    }
  
}