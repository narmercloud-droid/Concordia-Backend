"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentsRouter = void 0;
const express_1 = require("express");
exports.paymentsRouter = (0, express_1.Router)();
exports.paymentsRouter.post("/mollie/create", (req, res) => {
    res.json({ paymentUrl: "https://example.com" });
});
exports.paymentsRouter.post("/mollie/webhook", (req, res) => {
    res.sendStatus(200);
});
