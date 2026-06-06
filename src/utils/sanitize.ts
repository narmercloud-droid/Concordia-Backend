export function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function normalizeString(input: string) {
  // Remove control characters (0x00-0x1F, 0x7F) without using regex literals
  const s = input.trim();
  let out = "";
  for (let i = 0; i < s.length; i++) {
    const code = s.charCodeAt(i);
    if ((code >= 0x00 && code <= 0x1f) || code === 0x7f) continue;
    out += s[i];
  }
  return out;
}

function isPlainObject(obj: any) {
  return Object.prototype.toString.call(obj) === "[object Object]";
}

export function sanitizeObject<T = any>(obj: T): T {
  if (obj == null) return obj;
  if (Array.isArray(obj)) {
    return obj.map((v) => sanitizeObject(v)) as any;
  }
  if (typeof obj === "string") {
    const s = normalizeString(obj);
    return escapeHtml(s) as any;
  }
  if (typeof obj === "number" || typeof obj === "boolean") return obj;
  if (isPlainObject(obj)) {
    const out: any = Object.create(null);
    for (const key of Object.keys(obj as any)) {
      // prevent prototype pollution and keys starting with $ or containing dots
      if (key === "__proto__" || key === "constructor" || key.includes(".") || key.startsWith("$")) continue;
      const val = (obj as any)[key];
      out[key] = sanitizeObject(val);
    }
    return out;
  }
  return obj;
}
