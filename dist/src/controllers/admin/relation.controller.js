import { RelationService } from "../../services/admin/relation.service.js";
export class RelationController {
    static async getItemRelations(req, res, next) {
        try {
            const itemId = Number(req.params.itemId);
            const relations = await RelationService.getItemRelations(itemId);
            res.json(relations);
        }
        catch (err) {
            next(err);
        }
    }
    static async addVariant(req, res, next) {
        try {
            const itemId = Number(req.params.itemId);
            const { variantId } = req.body;
            const result = await RelationService.addVariant(itemId, variantId);
            res.status(201).json(result);
        }
        catch (err) {
            next(err);
        }
    }
    static async addTopping(req, res, next) {
        try {
            const itemId = Number(req.params.itemId);
            const { toppingId } = req.body;
            const result = await RelationService.addTopping(itemId, toppingId);
            res.status(201).json(result);
        }
        catch (err) {
            next(err);
        }
    }
    static async addExtra(req, res, next) {
        try {
            const itemId = Number(req.params.itemId);
            const { extraId } = req.body;
            const result = await RelationService.addExtra(itemId, extraId);
            res.status(201).json(result);
        }
        catch (err) {
            next(err);
        }
    }
    static async removeVariant(req, res, next) {
        try {
            const itemId = Number(req.params.itemId);
            const variantId = Number(req.params.variantId);
            await RelationService.removeVariant(itemId, variantId);
            res.json({ success: true });
        }
        catch (err) {
            next(err);
        }
    }
    static async removeTopping(req, res, next) {
        try {
            const itemId = Number(req.params.itemId);
            const toppingId = Number(req.params.toppingId);
            await RelationService.removeTopping(itemId, toppingId);
            res.json({ success: true });
        }
        catch (err) {
            next(err);
        }
    }
    static async removeExtra(req, res, next) {
        try {
            const itemId = Number(req.params.itemId);
            const extraId = Number(req.params.extraId);
            await RelationService.removeExtra(itemId, extraId);
            res.json({ success: true });
        }
        catch (err) {
            next(err);
        }
    }
}
