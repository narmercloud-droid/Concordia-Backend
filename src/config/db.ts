import { Pool } from "pg";
import { env } from "../config/env.ts";
import logger from "../logger.ts";

export const db = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: true
});

logger.info({ database: env.DATABASE_URL }, "Database pool configured");
