import type {Request, Response } from 'express';
import Profile from '../models/jobSeekerProfile.js';

const userProfile = async(req: Request, res:Response)=>{
    try{
        const profile = await Profile.findOne({useId: req.params.userId}); 
        if(!profile) return res.status(404).json({message: "Profile not found"});
    } catch(error: any){
        res.status(500).json({error: error.message})
    }
}

export default userProfile;