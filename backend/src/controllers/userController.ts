import bcrypt from "bcrypt";
import crypto from "crypto";
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



export const updateUserPassword = async (req: Request, res: Response) => {
    try {
        const { passwordResetCode } = req.params;
        const { newPassword } = req.body;

        if (!passwordResetCode) {
            return res.status(400).json({ message: "Reset token is required." });
        }

        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({ message: "New password is required and must be at least 6 characters." });
        }

        // 1️⃣ Hash token from URL
        const hashedToken = crypto
            .createHash("sha256")
            .update(passwordResetCode)
            .digest("hex");

        // 2️⃣ Find user by token and check expiration
        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(404).json({ message: "Invalid or expired reset token." });
        }

        // 3️⃣ Hash new password
        const passwordHash = await bcrypt.hash(newPassword, 10);

        // 4️⃣ Update user password and clear token
        user.passwordHash = passwordHash;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;

        await user.save();


        return res.status(200).json({ message: "Password updated successfully." });
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
};
