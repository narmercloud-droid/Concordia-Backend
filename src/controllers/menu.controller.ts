import { Request, Response, NextFunction } from "express";
import { menuService } from "../services/menu.service.js";
import { success, fail } from "./controllerHelper.js";
import { menuEntityBodySchema, menuAvailabilityBodySchema } from "../validation/menu.schema.js";
import { idParamSchema } from "../validation/common.schema.js";

const validationMessage = (issues: { message: string }[]) =>
  issues.map((i) => i.message).join(", ") || "Invalid input";

export const MenuController = {
  createCategory: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = menuEntityBodySchema.safeParse(req.body);
      if (!parsed.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
      }
      const category = await menuService.createCategory(parsed.data);
      return success(res, category, "Category created successfully");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  },

  updateCategory: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedBody = menuEntityBodySchema.safeParse(req.body);
      if (!parsedBody.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsedBody.error.issues), 400);
      }
      const parsedParams = idParamSchema.safeParse(req.params);
      if (!parsedParams.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsedParams.error.issues), 400);
      }
      const category = await menuService.updateCategory(parsedParams.data.id, parsedBody.data);
      return success(res, category, "Category updated successfully");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  },

  deleteCategory: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedParams = idParamSchema.safeParse(req.params);
      if (!parsedParams.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsedParams.error.issues), 400);
      }
      const category = await menuService.deleteCategory(parsedParams.data.id);
      return success(res, category, "Category deleted successfully");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  },

  createItem: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = menuEntityBodySchema.safeParse(req.body);
      if (!parsed.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
      }
      const item = await menuService.createItem(parsed.data);
      return success(res, item, "Item created successfully");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  },

  updateItem: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedBody = menuEntityBodySchema.safeParse(req.body);
      if (!parsedBody.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsedBody.error.issues), 400);
      }
      const parsedParams = idParamSchema.safeParse(req.params);
      if (!parsedParams.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsedParams.error.issues), 400);
      }
      const item = await menuService.updateItem(parsedParams.data.id, parsedBody.data);
      return success(res, item, "Item updated successfully");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  },

  deleteItem: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedParams = idParamSchema.safeParse(req.params);
      if (!parsedParams.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsedParams.error.issues), 400);
      }
      const item = await menuService.deleteItem(parsedParams.data.id);
      return success(res, item, "Item deleted successfully");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  },

  createVariant: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = menuEntityBodySchema.safeParse(req.body);
      if (!parsed.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
      }
      const variant = await menuService.createVariant(parsed.data);
      return success(res, variant, "Variant created successfully");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  },

  updateVariant: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedBody = menuEntityBodySchema.safeParse(req.body);
      if (!parsedBody.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsedBody.error.issues), 400);
      }
      const parsedParams = idParamSchema.safeParse(req.params);
      if (!parsedParams.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsedParams.error.issues), 400);
      }
      const variant = await menuService.updateVariant(parsedParams.data.id, parsedBody.data);
      return success(res, variant, "Variant updated successfully");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  },

  deleteVariant: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedParams = idParamSchema.safeParse(req.params);
      if (!parsedParams.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsedParams.error.issues), 400);
      }
      const variant = await menuService.deleteVariant(parsedParams.data.id);
      return success(res, variant, "Variant deleted successfully");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  },

  setItemAvailability: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedBody = menuAvailabilityBodySchema.safeParse(req.body);
      if (!parsedBody.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsedBody.error.issues), 400);
      }
      const parsedParams = idParamSchema.safeParse(req.params);
      if (!parsedParams.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsedParams.error.issues), 400);
      }
      const item = await menuService.setItemAvailability(parsedParams.data.id, parsedBody.data.available);
      return success(res, item, "Item availability updated successfully");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  },

  setVariantAvailability: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedBody = menuAvailabilityBodySchema.safeParse(req.body);
      if (!parsedBody.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsedBody.error.issues), 400);
      }
      const parsedParams = idParamSchema.safeParse(req.params);
      if (!parsedParams.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsedParams.error.issues), 400);
      }
      const variant = await menuService.setVariantAvailability(
        parsedParams.data.id,
        parsedBody.data.available
      );
      return success(res, variant, "Variant availability updated successfully");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  },

  listMenu: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const pageSize = Math.min(100, Math.max(10, parseInt(req.query.limit as string, 10) || 50));
      const menu = await menuService.listCategories(page, pageSize);
      return success(res, menu, "Menu fetched successfully");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  }
};
