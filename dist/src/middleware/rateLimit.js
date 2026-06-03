import rateLimit from "express-rate-limit";
export const apiLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 100, // limit each IP to 100 requests per minute
    message: {
        success: false,
        message: "Too many requests. Please slow down."
    }
});
