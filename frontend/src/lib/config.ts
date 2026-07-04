export function getBackendUrl(): string {
  return process.env.BACKEND_URL || "http://localhost:3001";
}

export function getPublicSocketUrl(): string {
  return process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_WS_URL || "http://localhost:3001";
}
