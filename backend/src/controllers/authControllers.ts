import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { google } from "googleapis";
import jwt from "jsonwebtoken";
import { signupUser } from "../auth/auth.services";
import { createResetToken } from "../auth/auth.token";
import User from "../models/User";
import { getGoogleOauthUrl, oauthClient } from "../util/googleOauthUtil";
import { sendPasswordReset } from "../util/sendVerification";


export const signup = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        const token = await signupUser(email, password);
        res.status(201).json({
            message: "Account created.please verify your email.",
            token,
        })
    } catch (error) {
        if (error instanceof Error) {
            console.error("Signup error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
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


//--------------------------------------Reset password---------------------------

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

        const { raw, hashed, expires } = createResetToken();

        user.passwordResetToken = hashed;
        user.passwordResetExpires = expires;
        await user.save();


        const resetLink = `${process.env.CLIENT_URL}/forgot-password/${raw}`;
        await sendPasswordReset(email, resetLink);

        return res.status(200).json({ message: "Reset email sent." });
    } catch (err) {
        return res.status(500).json({ message: "Server error." });
    }
};

//--------------------------------------------------------------------------


export const googleAuth = (req: Request, res: Response) => {

    const url = getGoogleOauthUrl();
    res.status(200).json({ url })

}


export const googleCallback = async (req: Request, res: Response) => {
    try {
        const code = req.query.code as string;
        if (!code) return res.status(400).json({ error: "Missing code" });

        const { tokens } = await oauthClient.getToken(code);
        oauthClient.setCredentials(tokens);

        const oauth2 = google.oauth2("v2");
        const { data } = await oauth2.userinfo.get({
            auth: oauthClient,
        });

        if (!data.email) {
            return res.status(400).json({ error: "No email from Google" });
        }

        let user = await User.findOne({ email: data.email });

        if (!user) {
            user = new User({
                email: data.email,
                passwordHash: undefined,
                googleId: data.id,
                emailVerified: true,
            });
            await user.save();
        }

        const token = jwt.sign(
            { userId: user._id.toString(), email: user.email },
            process.env.JWT_SECRET as string,
            { expiresIn: "2d" }
        );

        return res.redirect(
            `http://localhost:5173/oauth-success?token=${token}`
        );
    } catch (error: any) {
        console.error("🔥 GOOGLE CALLBACK ERROR");
        console.error(error);
        console.error(error?.message);
        console.error(error?.stack);

        return res.status(500).json({
            error: "Google OAuth failed",
            details: error?.message,
        });
    }

};
