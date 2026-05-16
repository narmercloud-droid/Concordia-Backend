import { PrismaClient } from "@prisma/client";
import { trackDatabaseQuery, trackDatabaseQueryError } from "../metrics/metrics.js";
import { getCurrentRequestProfile } from "../lib/profile.js";

export const prisma = new PrismaClient();

prisma.$use(async (params, next) => {
  const start = Date.now();
  try {
    const result = await next(params);
    const duration = (Date.now() - start) / 1000;
    trackDatabaseQuery(params.action, params.model || "unknown", duration);
    const profile = getCurrentRequestProfile();
    if (profile) {
      profile.dbQueryNs += (Date.now() - start) * 1e6;
    }
    return result;
  } catch (error) {
    const errorType = error instanceof Error ? error.constructor.name : "unknown";
    trackDatabaseQueryError(params.action, params.model || "unknown", errorType);
    throw error;
  }
});
