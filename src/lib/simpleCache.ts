const store = new Map<string, { value: unknown; expires: number }>();

export function getSimpleCache<T>(key: string): T | null {
  const entry = store.get(key);
  if (!entry || Date.now() > entry.expires) {
    store.delete(key);
    return null;
  }
  return entry.value as T;
}

export function setSimpleCache(key: string, value: unknown, ttlMs: number) {
  store.set(key, { value, expires: Date.now() + ttlMs });
}

export function deleteSimpleCache(key: string) {
  store.delete(key);
}

export function deleteSimpleCacheByPrefix(prefix: string) {
  for (const key of store.keys()) {
    if (key.startsWith(prefix)) store.delete(key);
  }
}
