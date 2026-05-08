import app from "./app";
import { connectDB } from "./shared/config/db";
import { env } from "./shared/config/env";

const start = async () => {
  try {
    await connectDB();

    app.listen(env.PORT, () => {
      console.log(`
🚀 SevaSetu API running
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Port    : ${env.PORT}
   Env     : ${env.NODE_ENV}
   Base URL: http://localhost:${env.PORT}/api/v1
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      `);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("⏳ SIGTERM received. Shutting down gracefully...");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("⏳ SIGINT received. Shutting down gracefully...");
  process.exit(0);
});

start();
