"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToppingController = void 0;
const topping_service_1 = require("../../services/admin/topping.service");
class ToppingController {
    static async getAll(_req, res) {
        const toppings = await topping_service_1.ToppingService.getAll();
        res.json(toppings);
        return;
    }
    static async getById(req, res) {
        const id = Number(req.params.id);
        const topping = await topping_service_1.ToppingService.getById(id);
        if (!topping) {
            return res.status(404).json({ error: "Topping not found" });
        }
        res.json(topping);
        return;
    }
    static async create(req, res) {
        const topping = await topping_service_1.ToppingService.create(req.body);
        res.status(201).json(topping);
    }
    static async update(req, res) {
        const id = Number(req.params.id);
        const topping = await topping_service_1.ToppingService.update(id, req.body);
        res.json(topping);
    }
    static async remove(req, res) {
        const id = Number(req.params.id);
        await topping_service_1.ToppingService.remove(id);
        res.json({ success: true });
    }
}
exports.ToppingController = ToppingController;
