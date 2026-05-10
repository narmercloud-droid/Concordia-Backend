"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEstimatedTimeSchema = exports.updateOrderStatusSchema = exports.createOrderSchema = void 0;
const zod_1 = require("zod");
exports.createOrderSchema = zod_1.z.object({
    body: zod_1.z.object({
        cartId: zod_1.z.string(),
        branch_id: zod_1.z.number().int().positive(),
    }),
});
exports.updateOrderStatusSchema = zod_1.z.object({
    params: zod_1.z.object({
        orderId: zod_1.z.string(),
    }),
    body: zod_1.z.object({
        status: zod_1.z.enum([
            "pending",
            "accepted",
            "preparing",
            "ready",
            "delivered",
        ]),
        estimated_time: zod_1.z.number().optional(),
    }),
});
// NEW — admin can update estimated time
exports.updateEstimatedTimeSchema = zod_1.z.object({
    estimated_time: zod_1.z.number().min(1),
});
