import express from "express";
import { login, signup } from "../controllers/authControllers";

export const authRouter = express.Router()

authRouter.post("/api/sign-up", signup)
authRouter.post("/api/login", login)