const store = new Map();
export function getSimpleCache(key) {
    const entry = store.get(key);
    if (!entry || Date.now() > entry.expires) {
        store.delete(key);
        return null;
    }
    return entry.value;
}
export function setSimpleCache(key, value, ttlMs) {
    store.set(key, { value, expires: Date.now() + ttlMs });
}
export function deleteSimpleCache(key) {
    store.delete(key);
}
