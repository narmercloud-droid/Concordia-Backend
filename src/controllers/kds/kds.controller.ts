import { Request, Response } from "express";
import { KDSService } from "../../services/kds/kds.service";

export class KDSController {
  // -----------------------------------------------------
  // KDS LOGIN
  // -----------------------------------------------------
  static async login(req: Request, res: Response) {
    const { kds_token } = req.body;

    if (!kds_token) {
      return res.status(400).json({ error: "kds_token is required" });
    }

    try {
      const kds = await KDSService.loginKDS(kds_token);
      console.log(`KDS login success: ${kds.name} (ID: ${kds.id})`);
      res.json({
        kds_id: kds.id,
        branch_id: kds.branch_id,
        name: kds.name,
      });
    } catch (err: any) {
      console.log(`KDS login failure: ${err.message}`);
      res.status(401).json({ error: err.message || "Failed to login KDS" });
    }
  }

  // -----------------------------------------------------
  // GET ORDERS FOR KDS
  // -----------------------------------------------------
  static async getOrders(req: Request, res: Response) {
    const { branch_id } = (req as any).kds;

    try {
      const orders = await KDSService.getBranchOrders(branch_id);
      res.json(orders);
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to get orders" });
    }
  }

  // -----------------------------------------------------
  // UPDATE ORDER STATUS - PREPARING
  // -----------------------------------------------------
  static async startPreparing(req: Request, res: Response) {
    const { order_id } = req.params;
    const { kds_id, branch_id } = (req as any).kds;

    try {
      const order = await KDSService.updateOrderStatus(order_id, "preparing", kds_id, branch_id);
      res.json(order);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  // -----------------------------------------------------
  // UPDATE ORDER STATUS - READY
  // -----------------------------------------------------
  static async markReady(req: Request, res: Response) {
    const { order_id } = req.params;
    const { kds_id, branch_id } = (req as any).kds;

    try {
      const order = await KDSService.updateOrderStatus(order_id, "ready", kds_id, branch_id);
      res.json(order);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  // -----------------------------------------------------
  // UPDATE ORDER STATUS - COMPLETED
  // -----------------------------------------------------
  static async completeOrder(req: Request, res: Response) {
    const { order_id } = req.params;
    const { kds_id, branch_id } = (req as any).kds;

    try {
      const order = await KDSService.updateOrderStatus(order_id, "completed", kds_id, branch_id);
      res.json(order);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}