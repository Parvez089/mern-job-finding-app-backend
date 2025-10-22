import type { Request , Response } from "express";

import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

interface RegisterBody {
  name: string;
  email: string;
  password: string;
  role: string;
}

export const register = async (req: Request<{}, {}, RegisterBody>, res: Response) => {
    try {
        const { name, email, password, role } = req.body;

        const validRoles = ["jobseeker", "employer", "admin"];
        const normalizedRole = role?.toLowerCase();
        if (!validRoles.includes(role?.toLowerCase())) {
            return res.status(400).json({ success: false, message: "Invalid role type" })
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ name, email, password: hashedPassword, role: normalizedRole })
        await newUser.save();

        res.status(201).json({ success: true, message: "User registered successfully" })
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message })
    }
}

// Login

export const login = async (req: Request<{}, {}, RegisterBody>, res: Response) => {
    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: "user not found" })
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ success: false, message: "Invalid credentials" })

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET!,
            { expiresIn: "2d" }
        )

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            }
        })

    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message })
    }
}

