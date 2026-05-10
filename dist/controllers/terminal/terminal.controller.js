"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TerminalController = void 0;
const terminal_service_1 = require("../../services/terminal/terminal.service");
const terminalEvents_1 = require("../../events/terminalEvents");
class TerminalController {
    // -----------------------------------------------------
    // ACTIVATE TERMINAL
    // -----------------------------------------------------
    static async activate(req, res) {
        const { branch_code } = req.body;
        if (!branch_code) {
            return res.status(400).json({ error: "branch_code is required" });
        }
        try {
            const activationToken = await terminal_service_1.TerminalService.activateTerminal(branch_code);
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
    static async register(req, res) {
        const { activation_token, terminal_name } = req.body;
        if (!activation_token || !terminal_name) {
            return res.status(400).json({ error: "activation_token and terminal_name are required" });
        }
        try {
            const terminal = await terminal_service_1.TerminalService.registerTerminal(activation_token, terminal_name);
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
    static async login(req, res) {
        const { terminal_token } = req.body;
        if (!terminal_token) {
            return res.status(400).json({ error: "terminal_token is required" });
        }
        try {
            const terminal = await terminal_service_1.TerminalService.loginTerminal(terminal_token);
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
    static async acknowledgeOrder(req, res) {
        const { order_id } = req.params;
        const { terminal_id } = req.terminal;
        try {
            const order = await terminal_service_1.TerminalService.acknowledgeOrder(order_id, terminal_id);
            res.json(order);
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
    // -----------------------------------------------------
    // ASSIGN ORDER
    // -----------------------------------------------------
    static async assignOrder(req, res) {
        const { order_id } = req.params;
        const { terminal_id } = req.terminal;
        try {
            const order = await terminal_service_1.TerminalService.assignOrderToTerminal(order_id, terminal_id);
            (0, terminalEvents_1.emitOrderAssigned)(order);
            res.json(order);
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
    // -----------------------------------------------------
    // ACCEPT ORDER
    // -----------------------------------------------------
    static async acceptOrder(req, res) {
        const { order_id } = req.params;
        const { terminal_id } = req.terminal;
        try {
            const order = await terminal_service_1.TerminalService.acceptOrder(order_id, terminal_id);
            (0, terminalEvents_1.emitOrderAccepted)(order);
            res.json(order);
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
    // -----------------------------------------------------
    // REJECT ORDER
    // -----------------------------------------------------
    static async rejectOrder(req, res) {
        const { order_id } = req.params;
        const { terminal_id } = req.terminal;
        try {
            const order = await terminal_service_1.TerminalService.rejectOrder(order_id, terminal_id);
            (0, terminalEvents_1.emitOrderRejected)(order, terminal_id);
            res.json(order);
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
    // -----------------------------------------------------
    // HEARTBEAT
    // -----------------------------------------------------
    static async heartbeat(req, res) {
        const { terminal_id } = req.terminal;
        try {
            await terminal_service_1.TerminalService.updateHeartbeat(terminal_id);
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
    static async ordersStream(req, res) {
        // Placeholder for streaming orders
        res.status(501).json({ error: "Not implemented" });
    }
}
exports.TerminalController = TerminalController;
