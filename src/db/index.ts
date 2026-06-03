import { Pool } from "pg";
import { env } from "../config/env.ts";

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});
