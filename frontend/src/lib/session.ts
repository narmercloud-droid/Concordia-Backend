import { cookies } from "next/headers";

export function getSession() {
  return cookies().get("session")?.value ?? null;
}

export function createSessionCookie(token: string) {
  return `session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`;
}

export function clearSessionCookie() {
  return `session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}
