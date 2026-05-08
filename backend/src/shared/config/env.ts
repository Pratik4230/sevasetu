import dotenv from "dotenv";
dotenv.config();

const getEnv = (key: string, fallback?: string): string => {
  const value = process.env[key] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

/** CORS `origin` option: `*`, a single URL, or comma-separated URLs. */
const parseCorsOrigin = (raw: string): string | string[] => {
  const v = raw.trim();
  if (v === "*") return "*";
  const list = v.split(",").map((s) => s.trim()).filter(Boolean);
  if (list.length === 0) return "*";
  if (list.length === 1) return list[0]!;
  return list;
};

export const env = {
  PORT: parseInt(getEnv("PORT", "3000"), 10),
  MONGODB_URI: getEnv("MONGO_URI"),
  JWT_SECRET: getEnv("JWT_SECRET"),
  JWT_EXPIRES_IN: getEnv("JWT_EXPIRES_IN", "7d"),
  CLOUDINARY_CLOUD_NAME: getEnv("CLOUDINARY_CLOUD_NAME"),
  CLOUDINARY_API_KEY: getEnv("CLOUDINARY_API_KEY"),
  CLOUDINARY_API_SECRET: getEnv("CLOUDINARY_API_SECRET"),
  CANCELLATION_CUTOFF_HOURS: parseInt(
    getEnv("CANCELLATION_CUTOFF_HOURS", "2"),
    10
  ),
  NODE_ENV: getEnv("NODE_ENV", "development"),
  /** Parsed for `cors` middleware (`*` | one origin | several origins). */
  CORS_ORIGIN: parseCorsOrigin(getEnv("CORS_ORIGIN", "*")),
};
