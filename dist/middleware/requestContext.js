import { asyncLocalStorage } from "../context/requestContext.js";
import logger from "../logger.js";
export default function requestContextMiddleware(req, _res, next) {
    const reqId = req.id || req.headers["x-request-id"] || null;
    const store = { requestId: reqId, logger: req.log || logger };
    asyncLocalStorage.run(store, () => {
        next();
    });
}
