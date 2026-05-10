"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const router = (0, express_1.Router)();
// Path to store JSON data
const dataPath = path_1.default.join(__dirname, "../../data");
const hoursFile = path_1.default.join(dataPath, "opening-hours.json");
const zonesFile = path_1.default.join(dataPath, "delivery-zones.json");
// Ensure data folder exists
if (!fs_1.default.existsSync(dataPath)) {
    fs_1.default.mkdirSync(dataPath);
}
// ----------------------
// Opening Hours
// ----------------------
router.get("/opening-hours", (req, res) => {
    if (!fs_1.default.existsSync(hoursFile)) {
        return res.json([
            { day: "Monday", open: "09:00", close: "18:00" },
            { day: "Tuesday", open: "09:00", close: "18:00" },
            { day: "Wednesday", open: "09:00", close: "18:00" },
            { day: "Thursday", open: "09:00", close: "18:00" },
            { day: "Friday", open: "09:00", close: "18:00" },
            { day: "Saturday", open: "10:00", close: "16:00" },
            { day: "Sunday", open: "Closed", close: "Closed" }
        ]);
    }
    const data = JSON.parse(fs_1.default.readFileSync(hoursFile, "utf8"));
    res.json(data);
});
router.post("/opening-hours", (req, res) => {
    fs_1.default.writeFileSync(hoursFile, JSON.stringify(req.body, null, 2));
    res.json({ success: true });
});
// ----------------------
// Delivery Zones
// ----------------------
router.get("/delivery-zones", (req, res) => {
    if (!fs_1.default.existsSync(zonesFile)) {
        return res.json([]);
    }
    const data = JSON.parse(fs_1.default.readFileSync(zonesFile, "utf8"));
    res.json(data);
});
router.post("/delivery-zones", (req, res) => {
    fs_1.default.writeFileSync(zonesFile, JSON.stringify(req.body, null, 2));
    res.json({ success: true });
});
// ----------------------
router.get("/", (req, res) => {
    res.json({ message: "Admin route working" });
});
exports.default = router;
