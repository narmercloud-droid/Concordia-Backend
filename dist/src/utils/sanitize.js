export function escapeHtml(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
export function normalizeString(input) {
    return input.trim().replace(/[\u0000-\u001F\u007F]+/g, "");
}
function isPlainObject(obj) {
    return Object.prototype.toString.call(obj) === "[object Object]";
}
export function sanitizeObject(obj) {
    if (obj == null)
        return obj;
    if (Array.isArray(obj)) {
        return obj.map((v) => sanitizeObject(v));
    }
    if (typeof obj === "string") {
        const s = normalizeString(obj);
        return escapeHtml(s);
    }
    if (typeof obj === "number" || typeof obj === "boolean")
        return obj;
    if (isPlainObject(obj)) {
        const out = Object.create(null);
        for (const key of Object.keys(obj)) {
            // prevent prototype pollution and keys starting with $ or containing dots
            if (key === "__proto__" || key === "constructor" || key.includes(".") || key.startsWith("$"))
                continue;
            const val = obj[key];
            out[key] = sanitizeObject(val);
        }
        return out;
    }
    return obj;
}
