import type { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
        branchId: string;
      };
      app?: any;
    }
  }
}

export {};
