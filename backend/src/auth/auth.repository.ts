// auth.repository.ts
import User from "../models/User";

export const findUserByEmail = (email: string) =>
    User.findOne({ email });

export const findUserByVerificationToken = (token: string) =>
    User.findOne({
        emailVerificationToken: token,
        emailVerificationExpires: { $gt: Date.now() },
    });

export const createUser = (data: Partial<typeof User>) =>
    new User(data).save();
