import { prisma } from "../prisma/client.js";
export async function validateTerminalToken(req, res, next) {
    const token = req.headers["x-terminal-token"];
    if (!token) {
        return res.status(401).json({ error: "Invalid or missing terminal token" });
    }
    try {
        const terminal = await prisma.terminal.findUnique({
            where: { activation_token: token },
        });
        if (!terminal) {
            return res.status(401).json({ error: "Invalid or missing terminal token" });
        }
        req.user = {
            id: terminal.id,
            role: "terminal",
            branchId: terminal.branchId,
        };
        next();
    }
    catch (error) {
        console.error("Terminal auth error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}
