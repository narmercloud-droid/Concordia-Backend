"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemController = void 0;
const item_service_1 = require("../../services/admin/item.service");
class ItemController {
    static async getAll(_req, res) {
        const items = await item_service_1.ItemService.getAll();
        res.json(items);
        return;
    }
    static async getById(req, res) {
        const id = Number(req.params.id);
        const item = await item_service_1.ItemService.getById(id);
        if (!item) {
            return res.status(404).json({ error: "Item not found" });
        }
        res.json(item);
        return;
    }
    static async create(req, res) {
        const item = await item_service_1.ItemService.create(req.body);
        res.status(201).json(item);
    }
    static async update(req, res) {
        const id = Number(req.params.id);
        const item = await item_service_1.ItemService.update(id, req.body);
        res.json(item);
    }
    static async remove(req, res) {
        const id = Number(req.params.id);
        await item_service_1.ItemService.remove(id);
        res.json({ success: true });
    }
}
exports.ItemController = ItemController;
