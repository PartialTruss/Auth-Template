import express from "express";
import { googleAuth, googleCallback, login, resetPassword, signup, verifyEmail } from "../controllers/authControllers";
import { updateUserPassword } from "../controllers/userController";

export const authRouter = express.Router()

authRouter.post("/api/sign-up", signup)
authRouter.post("/api/login", login)
authRouter.get("/verify-email", verifyEmail)
authRouter.put("/api/forgot-password", resetPassword)
authRouter.put(
    "/api/reset-password/:passwordResetCode",
    updateUserPassword
);

authRouter.get("/api/google/url", googleAuth)
authRouter.get("/google/callback", googleCallback);

