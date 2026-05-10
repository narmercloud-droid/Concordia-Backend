"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAdminLogin = handleAdminLogin;
const authService_1 = require("./authService");
async function handleAdminLogin(req, res, next) {
    try {
        const { email, password } = req.body;
        const result = await (0, authService_1.loginAdmin)(email, password);
        res.json({
            success: true,
            admin: {
                id: result.admin.id,
                email: result.admin.email
            },
            token: result.token
        });
    }
    catch (err) {
        next(err);
    }
}
