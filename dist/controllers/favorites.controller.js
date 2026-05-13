import { favoritesService } from "../services/favorites.service.js";
export const FavoritesController = {
    add: async (req, res, next) => {
        try {
            const customerId = req.user.id;
            const { itemId } = req.body;
            const fav = await favoritesService.addFavorite(customerId, itemId);
            res.json(fav);
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
            res.json({ success: true });
        }
        catch (err) {
            next(err);
        }
    },
    list: async (req, res, next) => {
        try {
            const customerId = req.user.id;
            const list = await favoritesService.listFavorites(customerId);
            res.json(list);
        }
        catch (err) {
            next(err);
        }
    },
    mostFavorited: async (req, res, next) => {
        try {
            const data = await favoritesService.mostFavoritedItems();
            res.json(data);
        }
        catch (err) {
            next(err);
        }
    }
};
