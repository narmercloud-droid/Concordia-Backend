import pool from "../db.ts";

export class PreferencesService {
  static async addPreference(userId: string, item: string, type: string) {
    await pool.query(
      `INSERT INTO preferences (user_id, item, preference_type)
       VALUES ($1, $2, $3)`,
      [userId, item, type]
    );
  }

  static async getPreferences(userId: string) {
    const result = await pool.query(
      `SELECT * FROM preferences WHERE user_id=$1`,
      [userId]
    );
    return result.rows;
  }
}

