import { forwardToBackend } from "../../../../lib/proxy.js";

type RouteContext = {
  params: { path: string[] };
};

async function proxyRequest(req: Request, { params }: RouteContext) {
  return forwardToBackend(req, params.path.join("/"));
}

export async function GET(req: Request, context: RouteContext) {
  return proxyRequest(req, context);
}

export async function POST(req: Request, context: RouteContext) {
  return proxyRequest(req, context);
}

export async function PUT(req: Request, context: RouteContext) {
  return proxyRequest(req, context);
}

export async function PATCH(req: Request, context: RouteContext) {
  return proxyRequest(req, context);
}

export async function DELETE(req: Request, context: RouteContext) {
  return proxyRequest(req, context);
}
