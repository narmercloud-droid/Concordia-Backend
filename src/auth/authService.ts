import pool from "../db";
import { comparePassword } from "../utils/hash";
import { signToken } from "../utils/jwt";

export async function loginAdmin(email: string, password: string) {
  const result = await pool.query(
    "SELECT * FROM admins WHERE email = $1 LIMIT 1",
    [email]
  );

  const admin = result.rows[0];
  if (!admin) throw new Error("Invalid credentials");

  const match = await comparePassword(password, admin.password_hash);
  if (!match) throw new Error("Invalid credentials");

  const token = signToken({ id: admin.id, role: "admin" });

  return { admin, token };
}
