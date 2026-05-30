import { ZodObject, ZodError } from "zod";
import type { Request, Response, NextFunction  } from "express";

export const validate = (schema: ZodObject<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        params: req.params,
        query: req.query
      });
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).tson({
          error: "Validation failed",
          details: err.issues
        });
      }
      next(err);
    }
  };
};


