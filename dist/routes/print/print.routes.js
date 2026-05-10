"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const print_controller_1 = require("../../controllers/print/print.controller");
const router = (0, express_1.Router)();
router.post("/order/:id", print_controller_1.PrintController.printOrder);
exports.default = router;
