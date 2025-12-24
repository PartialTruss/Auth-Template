import { Request, Response } from "express";
import { loginUser, signupUser, verifyEmailToken } from "../auth/auth.services";
import { createJwt, createResetToken } from "../auth/auth.token";
import User from "../models/User";
import { getGoogleOauthUrl } from "../util/googleOauthUtil";
import { sendPasswordReset } from "../util/sendVerification";
import { handleGoogleCallback } from "./auth.oauth";


//--------------------------------------Sign up---------------------------

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
//--------------------------------------Sign up---------------------------



//--------------------------------------Login---------------------------

export const login = async (req: Request, res: Response) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        const user = await loginUser(email, password)

        const token = await createJwt({ userId: user._id.toString(), email: user.email })

        res.json({
            message: "Login successful",
            token,
            userId: user._id,
        });
    } catch (error) {
        if (error instanceof Error) {
            res.status(401).json({ message: error.message })
        }
    }
};
//--------------------------------------Login---------------------------



//--------------------------------------Verify Email---------------------------

export const verifyEmail = async (req: Request, res: Response) => {
    try {

        const token = req.query.token as string

        await verifyEmailToken(token)

        res.json({ message: "Email verified successfully." })
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({
                message: "Email verification failed."
            })
        }
    }
}

//--------------------------------------Verify Email---------------------------



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

//--------------------------------------Reset password---------------------------


//--------------------------------------Google Oauth---------------------------

export const googleAuth = (req: Request, res: Response) => {
    const url = getGoogleOauthUrl();
    res.status(200).json({ url })

}

export const googleCallback = async (req: Request, res: Response) => {
    try {
        const code = req.query.code as string;
        if (!code) return res.status(400).json({ error: "Missing code" });

        const user = await handleGoogleCallback(code)

        const token = await createJwt({ userId: user._id.toString(), email: user.email })


        return res.redirect(
            `http://localhost:5173/oauth-success?token=${token}`
        );
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({
                error: "Google OAuth failed",
                details: error?.message,
            });
        }
    }


};

//--------------------------------------Google Oauth---------------------------
