import { ZodError } from "zod";
export const validate = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse({
                body: req.body,
                params: req.params,
                query: req.query
            });
            next();
        }
        catch (err) {
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
