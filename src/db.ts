import { Pool } from "pg";
import logger from "./logger.ts";
import { env } from "./config/env.ts";

const connectionString = env.DATABASE_URL;

logger.info({ connectionString: connectionString ?? null }, "Using DATABASE_URL");

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.connect()
  .then(() => logger.info("Connected to PostgreSQL"))
  .catch(err => logger.error({ err }, "PostgreSQL connection error"));

export default pool;
