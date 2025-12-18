import bcrypt from "bcrypt";
import crypto from "crypto";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { generateEmailToken } from "../util/emailToken";
import { getGoogleOauthUrl } from "../util/googleOauthUtil";
import { sendPasswordReset, sendVerificationEmail } from "../util/sendVerification";



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


        const emailToken = generateEmailToken()

        // Save user
        const newUser = new User({
            email,
            passwordHash,
            emailVerificationToken: emailToken,
            emailVerificationExpires: Date.now() + 1000 * 60 * 60
        });

        const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${emailToken}`

        await sendVerificationEmail(email, verificationLink)

        await newUser.save();


        res.status(201).json({ message: "Account created.Please verify your email." })


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

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
    }

    if (!user.isVerified) {
        return res.status(403).json({
            message: "Please verify your email first",
        });
    }

    const passwordIsCorrect = await bcrypt.compare(password, user.passwordHash);
    if (!passwordIsCorrect) {
        return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
        { userId: user._id.toString(), email: user.email },
        process.env.JWT_SECRET as string,
        { expiresIn: "2d" }
    );

    res.json({
        message: "Login successful",
        token,
        userId: user._id,
    });
};

export const verifyEmail = async (req: Request, res: Response) => {

    const { token } = req.query

    const user = await User.findOne({
        emailVerificationToken: token,
        emailVerificationExpires: { $gt: Date.now() }
    })

    if (!user) {
        return res.status(400).json({ message: "Invalid or expired token." })
    }

    user.isVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;

    await user.save()


    res.json({ message: "Email verified successfully." })

}


export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required." });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(200).json({
                message: "If the email exists, a reset link was sent.",
            });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");

        const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

        user.passwordResetToken = hashedToken;
        user.passwordResetExpires = Date.now() + 1000 * 60 * 15;
        await user.save();

        console.log(`✅ Reset token created for ${email}`);
        console.log(`Reset token (plain, send in email): ${resetToken}`);
        console.log(`Hashed token (DB): ${hashedToken}`);

        const resetLink = `${process.env.CLIENT_URL}/forgot-password/${resetToken}`;
        await sendPasswordReset(email, resetLink);

        return res.status(200).json({ message: "Reset email sent." });
    } catch (err) {
        return res.status(500).json({ message: "Server error." });
    }
};


export const googleAuth = (req: Request, res: Response) => {

    const url = getGoogleOauthUrl();
    res.status(200).json({ url })

}
