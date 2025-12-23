import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
    email: string;
    passwordHash?: string;
    isVerified: boolean;
    emailVerificationToken?: string;
    emailVerificationExpires?: Date;

    passwordResetToken?: string;
    passwordResetExpires?: Date;
}

const UserSchema = new Schema<IUser>({
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: false },

    isVerified: {
        type: Boolean,
        default: false,
    },

    emailVerificationToken: String,
    emailVerificationExpires: Date,

    passwordResetToken: String,
    passwordResetExpires: Date,
});

export default mongoose.models.User ||
    mongoose.model<IUser>("User", UserSchema);
