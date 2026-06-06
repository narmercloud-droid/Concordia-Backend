import pool from "../db.js";
export class PreferencesService {
    static async addPreference(userId, item, type) {
        await pool.query(`INSERT INTO preferences (user_id, item, preference_type)
       VALUES ($1, $2, $3)`, [userId, item, type]);
    }
    static async getPreferences(userId) {
        const result = await pool.query(`SELECT * FROM preferences WHERE user_id=$1`, [userId]);
        return result.rows;
    }
}
