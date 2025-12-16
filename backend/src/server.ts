import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { connectToDB } from "./config/db";
import { authRouter } from "./routes/authRoutes";

dotenv.config();

const app = express();
const PORT = 3000;

connectToDB();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

app.use(express.json());

app.use("/auth", authRouter);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
