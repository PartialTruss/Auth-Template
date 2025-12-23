// auth.service.ts
import bcrypt from "bcrypt";
import User from "../models/User";
import { generateEmailToken } from "../util/emailToken";
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

export const loginUser = (email: string, password: string) => {

    
}