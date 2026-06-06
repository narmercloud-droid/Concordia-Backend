import { AsyncLocalStorage } from "async_hooks";
export const requestProfile = new AsyncLocalStorage();
export const createRequestProfile = () => ({
    start: process.hrtime.bigint(),
    dbQueryNs: 0,
    redisQueryNs: 0,
});
export const getCurrentRequestProfile = () => {
    return requestProfile.getStore();
};
