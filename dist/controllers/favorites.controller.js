import { favoritesService } from "../services/favorites.service.js";
import { success, fail } from "./controllerHelper.js";
import { favoritesBodySchema } from "../validation/favorites.schema.js";
const validationMessage = (issues) => issues.map((i) => i.message).join(", ") || "Invalid input";
export const FavoritesController = {
    add: async (req, res, next) => {
        try {
            const customerId = req.user.id;
            const parsed = favoritesBodySchema.safeParse(req.body);
            if (!parsed.success) {
                return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
            }
            const { itemId } = parsed.data;
            const fav = await favoritesService.addFavorite(customerId, itemId);
            return success(res, fav, "Favorite added");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    },
    remove: async (req, res, next) => {
        try {
            const customerId = req.user.id;
            const parsed = favoritesBodySchema.safeParse(req.body);
            if (!parsed.success) {
                return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
            }
            const { itemId } = parsed.data;
            await favoritesService.removeFavorite(customerId, itemId);
            return success(res, { success: true }, "Favorite removed");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    },
    list: async (req, res, next) => {
        try {
            const customerId = req.user.id;
            const list = await favoritesService.listFavorites(customerId);
            return success(res, list, "Favorites listed");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    },
    listFavorites: async (req, res, next) => {
        try {
            const data = await favoritesService.mostFavoritedItems();
            return success(res, data, "Most favorited items");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    }
};
