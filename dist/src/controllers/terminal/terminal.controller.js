import { TerminalService } from "../../services/terminal/terminal.service.js";
export class TerminalController {
    // -----------------------------------------------------
    // ACTIVATE TERMINAL
    // -----------------------------------------------------
    static async activate(req, res, next) {
        const { branch_code } = req.body;
        if (!branch_code) {
            return res.status(400).json({ error: "branch_code is required" });
        }
        try {
            const activationToken = await TerminalService.activateTerminal(branch_code);
            res.json({ token: activationToken });
        }
        catch (err) {
            const status = err.message === "Branch not found" ? 404 : 500;
            res.status(status).json({ error: err.message || "Failed to generate terminal activation token" });
        }
    }
    // -----------------------------------------------------
    // REGISTER TERMINAL
    // -----------------------------------------------------
    static async register(req, res, next) {
        const { activation_token, terminal_name } = req.body;
        if (!activation_token || !terminal_name) {
            return res.status(400).json({ error: "activation_token and terminal_name are required" });
        }
        try {
            const terminal = await TerminalService.registerTerminal(activation_token, terminal_name);
            res.status(201).json({ terminal_id: terminal.id, branch_id: terminal.branch_id, terminal_token: terminal.terminal_token });
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
    // -----------------------------------------------------
    // TERMINAL LOGIN
    // -----------------------------------------------------
    static async login(req, res, next) {
        const { terminal_token } = req.body;
        if (!terminal_token) {
            return res.status(400).json({ error: "terminal_token is required" });
        }
        try {
            const terminal = await TerminalService.loginTerminal(terminal_token);
            console.log(`Terminal login success: ${terminal.name} (ID: ${terminal.id})`);
            res.json({
                terminal_id: terminal.id,
                branch_id: terminal.branch_id,
                terminal_token: terminal.terminal_token,
            });
        }
        catch (err) {
            console.log(`Terminal login failure: ${err.message}`);
            res.status(401).json({ error: err.message || "Failed to login terminal" });
        }
    }
    // -----------------------------------------------------
    // ACKNOWLEDGE ORDER
    // -----------------------------------------------------
    static async acknowledgeOrder(req, res, next) {
        const { order_id } = req.params;
        const { terminal_id } = req.terminal;
        try {
            const order = await TerminalService.acknowledgeOrder(order_id, terminal_id);
            res.json(order);
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
    // -----------------------------------------------------
    // ASSIGN ORDER
    // -----------------------------------------------------
    static async assignOrder(req, res, next) {
        const { order_id } = req.params;
        const { terminal_id } = req.terminal;
        try {
            await TerminalService.assignOrder(order_id, terminal_id);
            res.json({ status: "assigned" });
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
    // -----------------------------------------------------
    // ACCEPT ORDER
    // -----------------------------------------------------
    static async acceptOrder(req, res, next) {
        const { order_id } = req.params;
        const { terminal_id } = req.terminal;
        try {
            const order = await TerminalService.acceptOrder(order_id, terminal_id);
            res.json(order);
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
    // -----------------------------------------------------
    // REJECT ORDER
    // -----------------------------------------------------
    static async rejectOrder(req, res, next) {
        const { order_id } = req.params;
        const { terminal_id } = req.terminal;
        try {
            const order = await TerminalService.rejectOrder(order_id, terminal_id);
            res.json(order);
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
    // -----------------------------------------------------
    // HEARTBEAT
    // -----------------------------------------------------
    static async heartbeat(req, res, next) {
        const { terminal_id } = req.terminal;
        try {
            await TerminalService.updateHeartbeat(terminal_id);
            console.log(`Heartbeat received from terminal ${terminal_id}`);
            res.json({ status: "ok" });
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
    // -----------------------------------------------------
    // ORDERS STREAM
    // -----------------------------------------------------
    static async ordersStream(req, res, next) {
        // Placeholder for streaming orders
        res.status(501).json({ error: "Not implemented" });
    }
}
