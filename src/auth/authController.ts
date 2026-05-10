import { Request, Response, NextFunction } from "express";
import { loginAdmin } from "./authService";

export async function handleAdminLogin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, password } = req.body;
    const result = await loginAdmin(email, password);

    res.json({
      success: true,
      admin: {
        id: result.admin.id,
        email: result.admin.email
      },
      token: result.token
    });
  } catch (err) {
    next(err);
  }
}
