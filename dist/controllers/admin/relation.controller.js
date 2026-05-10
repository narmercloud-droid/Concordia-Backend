"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RelationController = void 0;
const relation_service_1 = require("../../services/admin/relation.service");
class RelationController {
    static async getItemRelations(req, res) {
        const itemId = Number(req.params.itemId);
        const relations = await relation_service_1.RelationService.getItemRelations(itemId);
        res.json(relations);
    }
    static async addVariant(req, res) {
        const itemId = Number(req.params.itemId);
        const { variantId } = req.body;
        const result = await relation_service_1.RelationService.addVariant(itemId, variantId);
        res.status(201).json(result);
    }
    static async addTopping(req, res) {
        const itemId = Number(req.params.itemId);
        const { toppingId } = req.body;
        const result = await relation_service_1.RelationService.addTopping(itemId, toppingId);
        res.status(201).json(result);
    }
    static async addExtra(req, res) {
        const itemId = Number(req.params.itemId);
        const { extraId } = req.body;
        const result = await relation_service_1.RelationService.addExtra(itemId, extraId);
        res.status(201).json(result);
    }
    static async removeVariant(req, res) {
        const itemId = Number(req.params.itemId);
        const variantId = Number(req.params.variantId);
        await relation_service_1.RelationService.removeVariant(itemId, variantId);
        res.json({ success: true });
    }
    static async removeTopping(req, res) {
        const itemId = Number(req.params.itemId);
        const toppingId = Number(req.params.toppingId);
        await relation_service_1.RelationService.removeTopping(itemId, toppingId);
        res.json({ success: true });
    }
    static async removeExtra(req, res) {
        const itemId = Number(req.params.itemId);
        const extraId = Number(req.params.extraId);
        await relation_service_1.RelationService.removeExtra(itemId, extraId);
        res.json({ success: true });
    }
}
exports.RelationController = RelationController;
