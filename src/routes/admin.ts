import { Router } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

// Path to store JSON data
const dataPath = path.join(__dirname, "../../data");
const hoursFile = path.join(dataPath, "opening-hours.json");
const zonesFile = path.join(dataPath, "delivery-zones.json");

// Ensure data folder exists
if (!fs.existsSync(dataPath)) {
  fs.mkdirSync(dataPath);
}

// ----------------------
// Opening Hours
// ----------------------

router.get("/opening-hours", (req, res) => {
  if (!fs.existsSync(hoursFile)) {
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

  const data = JSON.parse(fs.readFileSync(hoursFile, "utf8"));
  res.json(data);
});

router.post("/opening-hours", (req, res) => {
  fs.writeFileSync(hoursFile, JSON.stringify(req.body, null, 2));
  res.json({ success: true });
});

// ----------------------
// Delivery Zones
// ----------------------

router.get("/delivery-zones", (req, res) => {
  if (!fs.existsSync(zonesFile)) {
    return res.json([]);
  }

  const data = JSON.parse(fs.readFileSync(zonesFile, "utf8"));
  res.json(data);
});

router.post("/delivery-zones", (req, res) => {
  fs.writeFileSync(zonesFile, JSON.stringify(req.body, null, 2));
  res.json({ success: true });
});

// ----------------------

router.get("/", (req, res) => {
  res.json({ message: "Admin route working" });
});

export default router;
