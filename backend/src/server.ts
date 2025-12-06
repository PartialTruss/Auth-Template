import dotenv from "dotenv";
import express from "express";

import { connectToDB } from "./config/db";
import { authRouter } from "./routes/authRoutes";

dotenv.config();

const app = express();
const PORT = 3000;

if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET missing in .env");
    process.exit(1);
}

connectToDB();

app.use(express.json());
app.use("/", authRouter);



app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
