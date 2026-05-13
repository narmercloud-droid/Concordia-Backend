import { staffingPrepService } from "../services/staffingPrep.service.js";
import { NextFunction, Request, Response } from "express";

export const StaffingPrepController = {
  fullPlan: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const branchId = req.user!.branchId;
      const result = await staffingPrepService.fullPlan(branchId);
      res.json(result);
    } catch (err: unknown) {
      next(err);
    }
  },
};


