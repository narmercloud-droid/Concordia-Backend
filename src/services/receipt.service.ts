import pool from "../db.js";

export class ReceiptService {
  static async saveReceipt(orderId: number, receipt: any) {
    await pool.query(
      `INSERT INTO receipts (order_id, receipt_json)
       VALUES ($1, $2)`,
      [orderId, receipt]
    );
  }

  static async getReceipt(orderId: number) {
    const result = await pool.query(
      `SELECT * FROM receipts WHERE order_id=$1`,
      [orderId]
    );
    return result.rows[0];
  }
}

