

/** @format */
import type { Request } from "express";
import type { Express } from "express";
import DataURIParser from "datauri/parser.js";
import type { Response } from "express";
import cloudinary from "../config/cloudinary.ts";

import User from "../models/User.ts";


interface AuthenticatedRequest extends Request {
  user?: { id: string; role: string; name: string };
}

interface CustomRequest extends AuthenticatedRequest {
  file?: Express.Multer.File;
}

const handleError = (res: Response, error: unknown, statusCode = 500) => {
  const message = error instanceof Error ? error.message : "Unknown error";
  console.error("Error: ", error);
  res.status(statusCode).json({ success: false, message: message });
};


const parser = new DataURIParser();

const formatBufferToDataUri = (file: Express.Multer.File)=>{
  return  parser.format(file.originalname, file.buffer);

}

 const uploadToCloudinary = (fileBuffer: Buffer, folder: string) =>{
        return new Promise<any>((resolve, reject)=>{
            cloudinary.uploader.upload_stream({resource_type: "auto", folder}, (error, result)=>{
                if(error) reject(error);
                else resolve(result);
            }).end(fileBuffer)
        });
    };
export const getEmployerProfile = async(
    req:AuthenticatedRequest, res: Response
) =>{
    try{

     const userId = req.user?.id;
     if(!userId) return res.status(401).json({success: false, message: "Unauthorized"});

     const user = await User.findById(userId);
     if(!user) return res.status(404).json({success: false, message: "User not found"});

     res.json({success: true, message: user})
    }catch(error){
        handleError(res,error)
    }
}


export const updateEmployerProfile = async( req: CustomRequest, res: Response)=>{
    try{
        const userId = req.user?.id;
        if(!userId) return res.status(401).json({success: false, message: "Unauthorized"});

        const {name, phone, position} = req.body;
        const updateData: any = {name, phone, position};

        if (req.file) {
    const fileUri = formatBufferToDataUri(req.file);  

    if (!fileUri || !fileUri.content) {
        return res.status(400).json({ success: false, message: "Invalid file format" });
    }

    // Convert DataURI base64 → Buffer
    const fileBuffer = Buffer.from(
        fileUri.content.split(",")[1], 
        "base64"
    );

    // Upload file buffer to Cloudinary
    const uploadResult = await uploadToCloudinary(
        fileBuffer,
        "employer/profile"
    );

    updateData.ProfileImage = {
        public_id: uploadResult.public_id,
        secure_url: uploadResult.secure_url,
        folder: uploadResult.folder,
        width: uploadResult.width,
        height: uploadResult.height,
        format: uploadResult.format,
        resource_type: uploadResult.resource_type,
    };
}

        const updatedUser = await User.findByIdAndUpdate(userId, updateData, {new: true});
        res.json({success: true, message: "Profile updated", user: updatedUser})
    }catch(error){
    handleError(res, error);
}
} 

