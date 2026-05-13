import { Request, Response, NextFunction, RequestHandler } from "express";

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

