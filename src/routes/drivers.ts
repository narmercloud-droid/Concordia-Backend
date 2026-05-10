import { Router } from "express";
import {
  getAvailableDriversController,
  getDriverController
} from "../controllers/driverController";

const router = Router();

// Get all available drivers
router.get("/available", getAvailableDriversController);

// Get a specific driver
router.get("/:driverId", getDriverController);

export default router;
