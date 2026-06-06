// Load environment variables from .env
import dotenv from "dotenv";
dotenv.config();

// Required environment variables
const required = [
  "DATABASE_URL",
  "JWT_SECRET",
  "VAPID_PUBLIC_KEY",
  "VAPID_PRIVATE_KEY"
];

const missing = [];

for (const key of required) {
  if (!process.env[key] || process.env[key].trim() === "") {
    missing.push(key);
  }
}

if (missing.length > 0) {
  console.error("❌ Missing environment variables:", missing);
  process.exit(1);
} else {
  console.log("✅ All required environment variables are set.");
}
