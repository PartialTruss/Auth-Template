import express from "express";
import { updateUser, updateUserPassword } from "../controllers/userController";

export const userRouter = express.Router()

userRouter.put("/api/users/:userId", updateUser)
userRouter.put("/api/users/:passwordResetCode/forgot-password", updateUserPassword)
