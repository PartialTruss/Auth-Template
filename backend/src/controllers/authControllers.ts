import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";


export const signup = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        // Check if user exists
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(409).json({ error: "User already exists" });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Save user
        const newUser = new User({
            email,
            passwordHash,
        });

        await newUser.save();

        // Generate token
        const token = jwt.sign(
            { userId: newUser._id.toString(), email },
            process.env.JWT_SECRET as string,
            { expiresIn: "2d" }
        );

        res.json({
            userId: newUser._id,
            token,
        });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};



export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    // Correct: Look up user in MongoDB
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
    }

    // Correct: Compare password
    const passwordIsCorrect = await bcrypt.compare(password, user.passwordHash);
    if (!passwordIsCorrect) {
        return res.status(401).json({ error: "Invalid email or password" });
    }

    // Correct: Sign JWT using user info
    const token = jwt.sign(
        { userId: user._id.toString(), email: user.email },
        process.env.JWT_SECRET as string,
        { expiresIn: "2d" }
    );

    // Respond with token
    res.json({
        message: "Login successful",
        token,
        userId: user._id,
    });
};