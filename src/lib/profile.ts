import { AsyncLocalStorage } from "async_hooks";

export interface RequestProfile {
  start: bigint;
  dbQueryNs: number;
  redisQueryNs: number;
}

export const requestProfile = new AsyncLocalStorage<RequestProfile>();

export const createRequestProfile = (): RequestProfile => ({
  start: process.hrtime.bigint(),
  dbQueryNs: 0,
  redisQueryNs: 0,
});

export const getCurrentRequestProfile = (): RequestProfile | undefined => {
  return requestProfile.getStore();
};
