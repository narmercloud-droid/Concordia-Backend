"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginTerminalSchema = exports.registerTerminalSchema = exports.activateTerminalSchema = void 0;
const zod_1 = require("zod");
exports.activateTerminalSchema = zod_1.z.object({
    body: zod_1.z.object({
        branch_code: zod_1.z.string(),
    }),
});
exports.registerTerminalSchema = zod_1.z.object({
    body: zod_1.z.object({
        activation_token: zod_1.z.string(),
        terminal_name: zod_1.z.string(),
    }),
});
exports.loginTerminalSchema = zod_1.z.object({
    body: zod_1.z.object({
        terminal_token: zod_1.z.string(),
    }),
});
