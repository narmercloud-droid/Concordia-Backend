import { Request, Response, NextFunction } from "express";
import { requestProfile, createRequestProfile } from "../lib/profile.js";
import { apiRequestDuration, apiRouteLatency, trackApiRoute } from "../metrics/metrics.js";

export const profileMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const profile = createRequestProfile();

  requestProfile.run(profile, () => {
    res.on("finish", () => {
      const totalSeconds = Number(process.hrtime.bigint() - profile.start) / 1e9;
      const dbSeconds = profile.dbQueryNs / 1e9;
      const redisSeconds = profile.redisQueryNs / 1e9;
      const controllerSeconds = Math.max(0, totalSeconds - dbSeconds - redisSeconds);
      const route = req.route?.path || req.path || req.originalUrl;

      apiRequestDuration
        .labels(req.method, route, res.statusCode.toString())
        .observe(totalSeconds);

      apiRouteLatency
        .labels(req.method, route)
        .observe(controllerSeconds);

      // Track API route request
      trackApiRoute(req.method, route, res.statusCode);
    });

    next();
  });
};
