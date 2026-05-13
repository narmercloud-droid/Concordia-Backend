import { ExtraService } from "../../services/admin/extra.service.js";
export class ExtraController {
    static async getAll(_req, res, next) {
        try {
            const extras = await ExtraService.getAll();
            res.json(extras);
            return;
        }
        catch (err) {
            next(err);
        }
    }
    static async getById(req, res, next) {
        try {
            const id = Number(req.params.id);
            const extra = await ExtraService.getById(id);
            if (!extra) {
                return res.status(404).json({ error: "Extra not found" });
            }
            res.json(extra);
            return;
        }
        catch (err) {
            next(err);
        }
    }
    static async create(req, res, next) {
        try {
            const extra = await ExtraService.create(req.body);
            res.status(201).json(extra);
        }
        catch (err) {
            next(err);
        }
    }
    static async update(req, res, next) {
        try {
            const id = Number(req.params.id);
            const extra = await ExtraService.update(id, req.body);
            res.json(extra);
        }
        catch (err) {
            next(err);
        }
    }
    static async remove(req, res, next) {
        try {
            const id = Number(req.params.id);
            await ExtraService.remove(id);
            res.json({ success: true });
        }
        catch (err) {
            next(err);
        }
    }
}
