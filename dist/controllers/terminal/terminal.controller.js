import { TerminalService } from "../../services/terminal/terminal.service.js";
export class TerminalController {
    static async activate(req, res, next) {
        const { branchId } = req.body;
        if (!branchId) {
            return res.status(400).json({ error: "branchId is required" });
        }
        try {
            const activationToken = await TerminalService.activateTerminal(branchId);
            res.json({ token: activationToken });
        }
        catch (err) {
            const status = err.message === "Branch not found" ? 404 : 500;
            res.status(status).json({ error: err.message || "Failed to generate terminal activation token" });
        }
    }
    static async register(req, res, next) {
        const { activation_token, terminal_name } = req.body;
        if (!activation_token || !terminal_name) {
            return res.status(400).json({ error: "activation_token and terminal_name are required" });
        }
        try {
            const terminal = await TerminalService.registerTerminal(activation_token, terminal_name);
            res.status(201).json({ terminal_id: terminal.id, branchId: terminal.branchId });
        }
        catch (err) {
            let status = 400;
            if (err.message === "Branch not found")
                status = 404;
            if (err.message === "Terminal has already been registered")
                status = 409;
            res.status(status).json({ error: err.message || "Failed to register terminal" });
        }
    }
    static async login(req, res, next) {
        const { terminal_token } = req.body;
        if (!terminal_token) {
            return res.status(400).json({ error: "terminal_token is required" });
        }
        try {
            const terminal = await TerminalService.loginTerminal(terminal_token);
            res.json({ terminal_id: terminal.id, branchId: terminal.branchId });
        }
        catch (err) {
            res.status(401).json({ error: err.message || "Failed to login terminal" });
        }
    }
    static async acknowledgeOrder(req, res, next) {
        const { order_id } = req.params;
        const terminal_id = req.user?.id;
        try {
            const order = await TerminalService.acknowledgeOrder(order_id, terminal_id);
            res.json(order);
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
    static async assignOrder(req, res, next) {
        const { order_id } = req.params;
        const terminal_id = req.user?.id;
        try {
            await TerminalService.assignOrder(order_id, terminal_id);
            res.json({ status: "assigned" });
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
    static async acceptOrder(req, res, next) {
        const { order_id } = req.params;
        const terminal_id = req.user?.id;
        try {
            const order = await TerminalService.acceptOrder(order_id, terminal_id);
            res.json(order);
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
    static async rejectOrder(req, res, next) {
        const { order_id } = req.params;
        const terminal_id = req.user?.id;
        try {
            const order = await TerminalService.rejectOrder(order_id, terminal_id);
            res.json(order);
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
    static async heartbeat(req, res, next) {
        const terminal_id = req.user?.id;
        try {
            await TerminalService.updateHeartbeat(terminal_id);
            res.json({ status: "ok" });
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
    static async ordersStream(req, res, next) {
        res.status(501).json({ error: "Not implemented" });
    }
}
