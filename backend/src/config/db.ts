import dotenv from "dotenv"
import mongoose from "mongoose"

dotenv.config()

export const connectToDB = async () => {

    try {
        await mongoose.connect(process.env.MONGO_URI!)
        console.log("✅Successfully connected!");


    } catch (error) {
        if (error instanceof Error) {
            console.error("❌Error connecting to Database!", error.message);
            process.exit(1)
        }
        throw new Error
    }

}