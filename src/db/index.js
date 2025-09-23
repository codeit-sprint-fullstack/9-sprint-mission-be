import mongoose from "mongoose";
import { config } from "../config/config.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log("MongoDB conneted successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  await mongoose.connection.close();
};
