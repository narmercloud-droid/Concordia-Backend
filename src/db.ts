import dotenv from "dotenv";
dotenv.config(); // Load .env before anything else

import pkg from "pg";
const { Pool } = pkg;

const connectionString = process.env.DATABASE_URL;

console.log("🔌 Using DATABASE_URL:", connectionString);

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.connect()
  .then(() => console.log("✅ Connected to Neon PostgreSQL"))
  .catch(err => console.error("❌ PostgreSQL connection error:", err));

export default pool;
