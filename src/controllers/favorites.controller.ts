import type { Request  } from "express";
import { favoritesService } from "../services/favorites.service.ts";
import { wrap } from "../contracts/api.js";

export const FavoritesController = {
  add: wrap(async (req: Request) => {
    const customerId = req.user.id;
    const { itemId } = req.body;

    const fav = await favoritesService.addFavorite(customerId, itemId);
    return fav;
  }),

  remove: wrap(async (req: Request) => {
    const customerId = req.user.id;
    const { itemId } = req.body;

    await favoritesService.removeFavorite(customerId, itemId);
    return { success: true };
  }),

  list: wrap(async (req: Request) => {
    const customerId = req.user.id;
    const list = await favoritesService.listFavorites(customerId);
    return list;
  }),

  mostFavorited: wrap(async () => {
    const data = await favoritesService.mostFavoritedItems();
    return data;
  })
};






