import pino from "pino";
import pinoHttp from "pino-http";
import { randomUUID } from "crypto";
const level = process.env.LOG_LEVEL || "info";
const logger = pino({
    level,
    transport: process.env.NODE_ENV !== "production" ? { target: "pino-pretty" } : undefined,
});
const httpLogger = pinoHttp({
    logger,
    genReqId: (req) => {
        const headerId = req.headers["x-request-id"] || req.headers["x_request_id"] || req.headers["x_correlation_id"];
        return headerId || randomUUID();
    },
    customProps: (req, res) => ({
        reqId: req.id,
    }),
});
export default logger;
export { httpLogger };
