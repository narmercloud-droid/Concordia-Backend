import { cookies } from "next/headers";

const BACKEND_BASE = "http://localhost:3001/api/v1";

async function proxyRequest(req: Request, path: string | string[]) {
  const pathString = Array.isArray(path) ? path.join("/") : path;
  const url = `${BACKEND_BASE}/${pathString}`;

  const authToken = cookies().get("session")?.value;

  const headers = new Headers(req.headers);
  headers.set("Content-Type", "application/json");
  if (authToken) {
    headers.set("Authorization", `Bearer ${authToken}`);
  }
  headers.delete("host");

  const body = req.method === "GET" || req.method === "HEAD" ? undefined : await req.text();

  const response = await fetch(url, {
    method: req.method,
    headers,
    body
  });

  const responseBody = await response.text();
  const forwarded = new Response(responseBody, {
    status: response.status,
    headers: response.headers
  });

  return forwarded;
}

export async function GET(req: Request, { params }: { params: { path: string[] } }) {
  return proxyRequest(req, params.path);
}

export async function POST(req: Request, { params }: { params: { path: string[] } }) {
  return proxyRequest(req, params.path);
}

export async function PUT(req: Request, { params }: { params: { path: string[] } }) {
  return proxyRequest(req, params.path);
}

export async function DELETE(req: Request, { params }: { params: { path: string[] } }) {
  return proxyRequest(req, params.path);
}
