import { DealService } from "../../services/admin/deal.service.js";
export class DealController {
    static async getAll(_req, res, next) {
        try {
            const deals = await DealService.getAll();
            res.json(deals);
            return;
        }
        catch (err) {
            next(err);
        }
    }
    static async getById(req, res, next) {
        try {
            const id = Number(req.params.id);
            const deal = await DealService.getById(id);
            if (!deal) {
                return res.status(404).json({ error: "Deal not found" });
            }
            res.json(deal);
            return;
        }
        catch (err) {
            next(err);
        }
    }
    static async create(req, res, next) {
        try {
            const deal = await DealService.create(req.body);
            res.status(201).json(deal);
        }
        catch (err) {
            next(err);
        }
    }
    static async update(req, res, next) {
        try {
            const id = Number(req.params.id);
            const deal = await DealService.update(id, req.body);
            res.json(deal);
        }
        catch (err) {
            next(err);
        }
    }
    static async remove(req, res, next) {
        try {
            const id = Number(req.params.id);
            await DealService.remove(id);
            res.json({ success: true });
        }
        catch (err) {
            next(err);
        }
    }
    static async addItem(req, res, next) {
        try {
            const dealId = Number(req.params.dealId);
            const { itemId } = req.body;
            const result = await DealService.addItem(dealId, itemId);
            res.status(201).json(result);
        }
        catch (err) {
            next(err);
        }
    }
    static async removeItem(req, res, next) {
        try {
            const dealId = Number(req.params.dealId);
            const itemId = Number(req.params.itemId);
            await DealService.removeItem(dealId, itemId);
            res.json({ success: true });
        }
        catch (err) {
            next(err);
        }
    }
}
