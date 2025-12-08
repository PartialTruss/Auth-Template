import express from "express";
import { updateUser } from "../controllers/userController";

export const userRouter = express.Router()

userRouter.put("/api/users/:userId", updateUser)
