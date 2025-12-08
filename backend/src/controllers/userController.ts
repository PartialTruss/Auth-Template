import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/User";

interface TokenPayload extends JwtPayload {
    id: string;
}

export const updateUser = async (req: Request, res: Response) => {
    try {
        const { authorization } = req.headers;
        const { userId } = req.params;

        if (!authorization) {
            return res.status(401).json({ message: "No authorization header provided." });
        }

        const token = authorization.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Invalid Authorization header format." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;

        if (!decoded || decoded.id !== userId) {
            return res.status(403).json({ message: "You are not authorized to update this user." });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required." });
        }

        user.email = email;

        await user.save();

        return res.json({
            message: "User updated successfully.",
            user: {
                id: user._id,
                email: user.email,
            },
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server error.",
            error: error instanceof Error ? error.message : error,
        });
    }
};
