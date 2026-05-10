"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTerminalToken = validateTerminalToken;
const client_1 = require("../prisma/client");
async function validateTerminalToken(req, res, next) {
    const token = req.headers["x-terminal-token"];
    if (!token) {
        return res.status(401).json({ error: "Invalid or missing terminal token" });
    }
    try {
        const terminal = await client_1.prisma.branchTerminal.findUnique({
            where: { terminal_token: token },
        });
        if (!terminal) {
            return res.status(401).json({ error: "Invalid or missing terminal token" });
        }
        req.terminal = {
            terminal_id: terminal.id,
            branch_id: terminal.branch_id,
        };
        next();
    }
    catch (error) {
        console.error("Terminal auth error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}
