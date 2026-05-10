"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // Load .env before anything else
const pg_1 = __importDefault(require("pg"));
const { Pool } = pg_1.default;
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
exports.default = pool;
