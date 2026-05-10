"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DealController = void 0;
const deal_service_1 = require("../../services/admin/deal.service");
class DealController {
    static async getAll(_req, res) {
        const deals = await deal_service_1.DealService.getAll();
        res.json(deals);
        return;
    }
    static async getById(req, res) {
        const id = Number(req.params.id);
        const deal = await deal_service_1.DealService.getById(id);
        if (!deal) {
            return res.status(404).json({ error: "Deal not found" });
        }
        res.json(deal);
        return;
    }
    static async create(req, res) {
        const deal = await deal_service_1.DealService.create(req.body);
        res.status(201).json(deal);
    }
    static async update(req, res) {
        const id = Number(req.params.id);
        const deal = await deal_service_1.DealService.update(id, req.body);
        res.json(deal);
    }
    static async remove(req, res) {
        const id = Number(req.params.id);
        await deal_service_1.DealService.remove(id);
        res.json({ success: true });
    }
    static async addItem(req, res) {
        const dealId = Number(req.params.dealId);
        const { itemId } = req.body;
        const result = await deal_service_1.DealService.addItem(dealId, itemId);
        res.status(201).json(result);
    }
    static async removeItem(req, res) {
        const dealId = Number(req.params.dealId);
        const itemId = Number(req.params.itemId);
        await deal_service_1.DealService.removeItem(dealId, itemId);
        res.json({ success: true });
    }
}
exports.DealController = DealController;
