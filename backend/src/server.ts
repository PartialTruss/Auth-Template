import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { connectToDB } from "./config/db";
import { authRouter } from "./routes/authRoutes";

dotenv.config();

const app = express();
const PORT = 3000;

connectToDB();

// 🔴 MUST be first
app.use(cors({
    origin: "http://localhost:5173",
}));

app.use(express.json());

// 🔴 Mount router AFTER middleware
app.use("/auth", authRouter);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
