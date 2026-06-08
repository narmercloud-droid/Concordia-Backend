import type { Request, Response, NextFunction } from "express";
import multer from "multer";
import { fail } from "../contracts/api.js";

export const uploadMenuImage = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter(_req, file, cb) {
    const ok = ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.mimetype);
    cb(ok ? null : new Error("Only image files are allowed"), ok);
  }
});

export function handleMenuImageUpload(req: Request, res: Response, next: NextFunction) {
  uploadMenuImage.single("image")(req, res, (err) => {
    if (!err) return next();
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return next(fail("INVALID_INPUT", "Image must be 5 MB or smaller"));
      }
      return next(fail("INVALID_INPUT", err.message));
    }
    return next(fail("INVALID_INPUT", err.message || "Invalid image upload"));
  });
}