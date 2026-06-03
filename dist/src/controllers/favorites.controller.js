import { favoritesService } from "../services/favorites.service.js";
import { success } from "./controllerHelper.js";
export const FavoritesController = {
    add: async (req, res, next) => {
        try {
            const customerId = req.user.id;
            const { itemId } = req.body;
            const fav = await favoritesService.addFavorite(customerId, itemId);
            return success(res, fav);
        }
        catch (err) {
            next(err);
        }
    },
    remove: async (req, res, next) => {
        try {
            const customerId = req.user.id;
            const { itemId } = req.body;
            await favoritesService.removeFavorite(customerId, itemId);
            return success(res, { success: true });
        }
        catch (err) {
            next(err);
        }
    },
    list: async (req, res, next) => {
        try {
            const customerId = req.user.id;
            const list = await favoritesService.listFavorites(customerId);
            return success(res, list);
        }
        catch (err) {
            next(err);
        }
    },
    mostFavorited: async (req, res, next) => {
        try {
            const data = await favoritesService.mostFavoritedItems();
            return success(res, data);
        }
        catch (err) {
            next(err);
        }
    }
};
