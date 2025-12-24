// auth.service.ts
import bcrypt from "bcrypt";
import { google } from "googleapis";
import User from "../models/User";
import { generateEmailToken } from "../util/emailToken";
import { oauthClient } from "../util/googleOauthUtil";
import {
    sendVerificationEmail
} from "../util/sendVerification";
import {
    findUserByEmail
} from "./auth.repository";
import { createJwt } from "./auth.token";

export const signupUser = async (email: string, password: string) => {
    const existing = await findUserByEmail(email);
    if (existing) throw new Error("USER_EXISTS");

    const passwordHash = await bcrypt.hash(password, 10);
    const emailToken = generateEmailToken();

    const user = await new User({
        email,
        passwordHash,
        emailVerificationToken: emailToken,
        emailVerificationExpires: Date.now() + 1000 * 60 * 60,
    }).save();

    const link = `${process.env.CLIENT_URL}/verify-email?token=${emailToken}`;
    await sendVerificationEmail(email, link);

    return createJwt({ userId: user._id.toString(), email });
};

export const loginUser = async (email: string, password: string) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("Invalid email or password");
    }

    if (!user.isVerified) {
        throw new Error("Please verify your email first");
    }

    const passwordIsCorrect = await bcrypt.compare(password, user.passwordHash);
    if (!passwordIsCorrect) {
        throw new Error("Invalid email or password");
    }

    return user; // ✅ IMPORTANT
};



export const verifyEmailToken = async (token: string) => {

    const user = await User.findOne({
        emailVerificationToken: token,
        emailVerificationExpires: { $gt: Date.now() }
    })

    if (!user) {
        throw new Error("Invalid or expired token.")
    }

    user.isVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;

    await user.save()


}

