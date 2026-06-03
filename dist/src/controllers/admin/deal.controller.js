import { DealService } from "../../services/admin/deal.service.js";
import { success, fail } from "../controllerHelper.js";
export class DealController {
    static async getAll(_req, res, next) {
        try {
            const deals = await DealService.getAll();
            return success(res, deals);
        }
        catch (err) {
            next(err);
        }
    }
    static async getById(req, res, next) {
        try {
            const id = req.params.id;
            const deal = await DealService.getById(id);
            if (!deal) {
                return fail(res, "Deal not found", 404);
            }
            return success(res, deal);
        }
        catch (err) {
            next(err);
        }
    }
    static async create(req, res, next) {
        try {
            const deal = await DealService.create(req.body);
            return success(res, deal);
        }
        catch (err) {
            next(err);
        }
    }
    static async update(req, res, next) {
        try {
            const id = req.params.id;
            const deal = await DealService.update(id, req.body);
            return success(res, deal);
        }
        catch (err) {
            next(err);
        }
    }
    static async remove(req, res, next) {
        try {
            const id = req.params.id;
            await DealService.remove(id);
            return success(res, { success: true });
        }
        catch (err) {
            next(err);
        }
    }
}
