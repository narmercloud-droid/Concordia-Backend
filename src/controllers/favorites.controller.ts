import { Response, NextFunction } from "express";
import type { AuthenticatedRequest } from "../globalTypes.js";
import { favoritesService } from "../services/favorites.service.js";
import { success, fail } from "./controllerHelper.js";
import { favoritesBodySchema } from "../validation/favorites.schema.js";

const validationMessage = (issues: { message: string }[]) =>
  issues.map((i) => i.message).join(", ") || "Invalid input";

export const FavoritesController = {
  add: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const customerId = req.user!.id;
      const parsed = favoritesBodySchema.safeParse(req.body);
      if (!parsed.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
      }
      const { itemId } = parsed.data;

      const fav = await favoritesService.addFavorite(customerId, itemId);
      return success(res, fav, "Favorite added");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  },

  remove: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const customerId = req.user!.id;
      const parsed = favoritesBodySchema.safeParse(req.body);
      if (!parsed.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
      }
      const { itemId } = parsed.data;

      await favoritesService.removeFavorite(customerId, itemId);
      return success(res, { success: true }, "Favorite removed");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  },

  list: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const customerId = req.user!.id;
      const list = await favoritesService.listFavorites(customerId);
      return success(res, list, "Favorites listed");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  },

  listFavorites: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const data = await favoritesService.mostFavoritedItems();
      return success(res, data, "Most favorited items");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  }
};
