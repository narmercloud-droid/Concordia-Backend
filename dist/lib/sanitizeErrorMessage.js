const SECRET_PATTERNS = [
    /\bsk_(?:live|test)_[A-Za-z0-9]+\b/g,
    /\bpk_(?:live|test)_[A-Za-z0-9]+\b/g,
    /\brk_(?:live|test)_[A-Za-z0-9]+\b/g
];
export function sanitizeClientErrorMessage(message) {
    if (!message)
        return undefined;
    let sanitized = message;
    for (const pattern of SECRET_PATTERNS) {
        sanitized = sanitized.replace(pattern, "[redacted]");
    }
    return sanitized.trim() || undefined;
}
