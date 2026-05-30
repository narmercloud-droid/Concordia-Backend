import type { Request, Response, NextFunction, RequestHandler  } from "express";

export function controller<T extends Record<string, RequestHandler>>(handlers: T): T {
  const wrapped = {} as Record<string, RequestHandler>;

  for (const [name, handler] of Object.entries(handlers)) {
    wrapped[name] = async (req: Request, res: Response, next: NextFunction) => {
      try {
        await (handler as any)(req, res, next);
      } catch (err: unknown) {
        next(err);
      }
    };
  }

  return wrapped as T;
}

export const success = (res: Response, data: unknown, message = "Success", status = 200) => {
  return res.status(status).json({
    success: true,
    message,
    data
  });
};

export const fail = (res: Response, a: string, b?: string | number, c?: number) => {
  // Supports two call styles:
  // 1) fail(res, message, status?)
  // 2) fail(res, code, message, status?)
  if (typeof b === "number" || (typeof b === "undefined" && typeof c === "number")) {
    const message = a;
    const status = typeof b === "number" ? b : c ?? 400;
    return res.status(status).json({ success: false, message });
  }

  if (typeof b === "string") {
    const code = a;
    const message = b;
    const status = typeof c === "number" ? c : 400;
    return res.status(status).json({ success: false, code, message });
  }

  return res.status(400).json({ success: false, message: a });
};

// Simple value-returning helpers (non-HTTP) for code that expects plain objects
export const successPlain = (data: any) => ({ success: true, data });
export const failPlain = (message: string) => ({ success: false, message });


