


import type {Request, Response} from "express"
import cloudinary from '../config/cloudinary.ts';
import User from "../models/User.ts";
interface AuthenticatedRequest extends Request{
    user?: {id: string; role: string; name: string};
}

interface CustomRequest extends AuthenticatedRequest {
    file?: Express.Multer.File;
}

const handleError = (res: Response, error: unknown, statusCode = 500) =>{
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error: ", error)
    res.status(statusCode).json({success: false, message: message})
}

const uploadToCloudinary = (fileBuffer: Buffer, folder: string) =>{
    return new Promise<any>((resolve, reject)=>{
        const uploadStrem = cloudinary.uploader.upload_stream({
            resource_type: "auto", folder: folder
        },(error, result)=>{
            if(error) return reject(error);
            resolve(result);
        })
        uploadStrem.end(fileBuffer)
    })
}

export const getEmployerProfile = async (req: AuthenticatedRequest, res: Response)=>{
    try{
        const userId = req.user?.id;
        if(!userId) return res.status(401).json({success: false, message: "unauthorized"});
        const user = await User.findById(userId).select("-passowrd");
        if(!user) return res.status(404).json({success: false, message: "User not found"})

        res.status(200).json({
          name: user.name,
          companyName: user.companyName || "No Company Set",
          profilePicture: user.ProfileImage?.secure_url || null,
          email: user.email,
          position: user.position,
        });
    } catch(error){
        handleError(res,error)
    }
}


export const updateEmployerProfile = async (req: CustomRequest, res: Response) =>{
    try{
        const userId = req.user?.id;
        if(!userId) return res.status(401).json({success: false, message: "Unauthorized"})
        const {name, phone, position} = req.body;
        const updateData: any = {name, phone, position};

        if(req.file){
            const uploadResult = await uploadToCloudinary(req.file.buffer, "employer/profile");

            updateData.ProfileImage = {
                public_id: uploadResult.public_id,
                secure_url: uploadResult.secure_url,
                format: uploadResult.format,
                resource_type: uploadResult.resource_type,
            }
        }

        const updatedUser = await User.findByIdAndUpdate(userId, updateData, {new: true});


        if(!updatedUser){
            return res.status(404).json({success: false, message: "user not found"});
        }

        res.json({
            success: true, message: "Profile updated successfully", user: updatedUser
        });
    } catch(error){
        handleError(res,error)
    }
}