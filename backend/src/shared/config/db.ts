import mongoose from "mongoose";
import { env } from "./env";

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 3000;

export const connectDB = async (): Promise<void> => {
  let attempts = 0;

  while (attempts < MAX_RETRIES) {
    try {
      await mongoose.connect(env.MONGODB_URI);
      console.log("✅ MongoDB connected successfully");
      return;
    } catch (error) {
      attempts++;
      console.error(
        `❌ MongoDB connection failed (attempt ${attempts}/${MAX_RETRIES}):`,
        error
      );
      if (attempts < MAX_RETRIES) {
        console.log(`⏳ Retrying in ${RETRY_DELAY_MS / 1000}s...`);
        await new Promise((res) => setTimeout(res, RETRY_DELAY_MS));
      }
    }
  }

  throw new Error("Could not connect to MongoDB after maximum retries");
};

mongoose.connection.on("disconnected", () => {
  console.warn("⚠️  MongoDB disconnected");
});

mongoose.connection.on("reconnected", () => {
  console.log("🔄 MongoDB reconnected");
});
