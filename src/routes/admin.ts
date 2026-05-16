import { Router } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { success, fail } from "../controllers/controllerHelper.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

const dataPath = path.join(__dirname, "../../data");
const hoursFile = path.join(dataPath, "opening-hours.json");
const zonesFile = path.join(dataPath, "delivery-zones.json");

if (!fs.existsSync(dataPath)) {
  fs.mkdirSync(dataPath);
}

router.get("/opening-hours", (req, res) => {
  try {
    if (!fs.existsSync(hoursFile)) {
      return success(
        res,
        [
          { day: "Monday", open: "09:00", close: "18:00" },
          { day: "Tuesday", open: "09:00", close: "18:00" },
          { day: "Wednesday", open: "09:00", close: "18:00" },
          { day: "Thursday", open: "09:00", close: "18:00" },
          { day: "Friday", open: "09:00", close: "18:00" },
          { day: "Saturday", open: "10:00", close: "16:00" },
          { day: "Sunday", open: "Closed", close: "Closed" }
        ],
        "Default opening hours"
      );
    }

    const data = JSON.parse(fs.readFileSync(hoursFile, "utf8"));
    return success(res, data, "Opening hours");
  } catch (err: unknown) {
    return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
  }
});

router.post("/opening-hours", (req, res) => {
  try {
    fs.writeFileSync(hoursFile, JSON.stringify(req.body, null, 2));
    return success(res, null, "Opening hours saved");
  } catch (err: unknown) {
    return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
  }
});

router.get("/delivery-zones", (req, res) => {
  try {
    if (!fs.existsSync(zonesFile)) {
      return success(res, [], "No delivery zones configured");
    }

    const data = JSON.parse(fs.readFileSync(zonesFile, "utf8"));
    return success(res, data, "Delivery zones");
  } catch (err: unknown) {
    return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
  }
});

router.post("/delivery-zones", (req, res) => {
  try {
    fs.writeFileSync(zonesFile, JSON.stringify(req.body, null, 2));
    return success(res, null, "Delivery zones saved");
  } catch (err: unknown) {
    return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
  }
});

router.get("/", (req, res) => {
  try {
    return success(res, { message: "Admin route working" }, "OK");
  } catch (err: unknown) {
    return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
  }
});

export default router;
