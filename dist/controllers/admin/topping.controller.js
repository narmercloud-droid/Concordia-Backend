import { ToppingService } from "../../services/admin/topping.service.js";
export class ToppingController {
    static async getAll(_req, res, next) {
        try {
            const toppings = await ToppingService.getAll();
            res.json(toppings);
            return;
        }
        catch (err) {
            next(err);
        }
    }
    static async getById(req, res, next) {
        try {
            const id = req.params.id;
            const topping = await ToppingService.getById(id);
            if (!topping) {
                return res.status(404).json({ error: "Topping not found" });
            }
            res.json(topping);
            return;
        }
        catch (err) {
            next(err);
        }
    }
    static async create(req, res, next) {
        try {
            const topping = await ToppingService.create(req.body);
            res.status(201).json(topping);
        }
        catch (err) {
            next(err);
        }
    }
    static async update(req, res, next) {
        try {
            const id = req.params.id;
            const topping = await ToppingService.update(id, req.body);
            res.json(topping);
        }
        catch (err) {
            next(err);
        }
    }
    static async remove(req, res, next) {
        try {
            const id = req.params.id;
            await ToppingService.remove(id);
            res.json({ success: true });
        }
        catch (err) {
            next(err);
        }
    }
}
