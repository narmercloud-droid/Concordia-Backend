"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const driverController_1 = require("../controllers/driverController");
const router = (0, express_1.Router)();
// Get all available drivers
router.get("/available", driverController_1.getAvailableDriversController);
// Get a specific driver
router.get("/:driverId", driverController_1.getDriverController);
exports.default = router;
