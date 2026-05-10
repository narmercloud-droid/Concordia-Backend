"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuController = void 0;
const menu_service_1 = require("../services/menu.service");
class MenuController {
    static async getMenu(req, res) {
        try {
            const menu = await menu_service_1.MenuService.getFullMenu();
            res.status(200).json(menu);
        }
        catch (error) {
            console.error("Menu fetch error:", error);
            res.status(500).json({ error: "Failed to load menu" });
        }
    }
}
exports.MenuController = MenuController;
