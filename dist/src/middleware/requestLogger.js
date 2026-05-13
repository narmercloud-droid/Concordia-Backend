import logger from "../utils/logger";
export const requestLogger = (req, res, next) => {
    logger.info(`${req.method} ${req.originalUrl}`);
    next();
};
