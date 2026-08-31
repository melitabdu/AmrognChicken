import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("Database connected successfully");
  } catch (err) {
    console.error("Connection error:", err.message);
    process.exit(1);
  }
};