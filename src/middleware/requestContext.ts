import type { Request, Response, NextFunction } from "express";
import { asyncLocalStorage } from "../context/requestContext.ts";
import logger from "../logger.ts";

export default function requestContextMiddleware(req: Request, _res: Response, next: NextFunction) {
  const reqId = (req as any).id || (req.headers["x-request-id"] as string) || null;
  const store = { requestId: reqId, logger: (req as any).log || logger };

  asyncLocalStorage.run(store, () => {
    next();
  });
}
