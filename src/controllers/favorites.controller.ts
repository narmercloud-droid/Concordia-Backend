import type { Request, Response, NextFunction  } from "express";
import { favoritesService } from "../services/favorites.service.js";
import { success } from "./controllerHelper.js";

export const FavoritesController = {
  add: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const customerId = req.user.id;
      const { itemId } = req.body;

      const fav = await favoritesService.addFavorite(customerId, itemId);
      return success(res, fav);
    } catch (err: unknown) {
      next(err);
    }
  },

  remove: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const customerId = req.user.id;
      const { itemId } = req.body;

      await favoritesService.removeFavorite(customerId, itemId);
      return success(res, { success: true });
    } catch (err: unknown) {
      next(err);
    }
  },

  list: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const customerId = req.user.id;
      const list = await favoritesService.listFavorites(customerId);
      return success(res, list);
    } catch (err: unknown) {
      next(err);
    }
  },

  mostFavorited: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await favoritesService.mostFavoritedItems();
      return success(res, data);
    } catch (err: unknown) {
      next(err);
    }
  }
};






