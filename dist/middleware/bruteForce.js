import client from "../redis/redisClient.js";
import logger from "../logger.js";
const WINDOW_SECONDS = 15 * 60; // 15 minutes
const LIMIT = 10;
function ipKey(ip) {
    return `bf:login:ip:${ip}`;
}
function userKey(userId) {
    return `bf:login:user:${userId}`;
}
export async function isBlockedByIp(ip) {
    try {
        if (!client || typeof client.get !== "function")
            return false;
        const v = await client.get(ipKey(ip));
        return Number(v || 0) >= LIMIT;
    }
    catch (err) {
        logger.warn({ err }, "isBlockedByIp check failed");
        return false;
    }
}
export async function incrFailureForIp(ip) {
    try {
        if (!client || typeof client.incr !== "function")
            return;
        const v = await client.incr(ipKey(ip));
        if (v === 1)
            await client.expire(ipKey(ip), WINDOW_SECONDS);
        return v;
    }
    catch (err) {
        logger.warn({ err }, "incrFailureForIp failed");
    }
}
export async function resetFailuresForIp(ip) {
    try {
        if (!client || typeof client.del !== "function")
            return;
        await client.del(ipKey(ip));
    }
    catch (err) {
        logger.warn({ err }, "resetFailuresForIp failed");
    }
}
export async function isBlockedByUser(userIdentifier) {
    try {
        if (!client || typeof client.get !== "function")
            return false;
        const v = await client.get(userKey(userIdentifier));
        return Number(v || 0) >= LIMIT;
    }
    catch (err) {
        logger.warn({ err }, "isBlockedByUser check failed");
        return false;
    }
}
export async function incrFailureForUser(userIdentifier) {
    try {
        if (!client || typeof client.incr !== "function")
            return;
        const v = await client.incr(userKey(userIdentifier));
        if (v === 1)
            await client.expire(userKey(userIdentifier), WINDOW_SECONDS);
        return v;
    }
    catch (err) {
        logger.warn({ err }, "incrFailureForUser failed");
    }
}
export async function resetFailuresForUser(userIdentifier) {
    try {
        if (!client || typeof client.del !== "function")
            return;
        await client.del(userKey(userIdentifier));
    }
    catch (err) {
        logger.warn({ err }, "resetFailuresForUser failed");
    }
}
