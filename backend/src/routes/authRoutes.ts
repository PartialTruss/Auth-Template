import express from "express";
import { login, resetPassword, signup, verifyEmail } from "../controllers/authControllers";

export const authRouter = express.Router()

authRouter.post("/api/sign-up", signup)
authRouter.post("/api/login", login)
authRouter.get("/verify-email", verifyEmail)
authRouter.put("/api/forgot-password/:email", resetPassword)