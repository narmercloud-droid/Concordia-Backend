import { getAvailableDrivers, getDriver } from "../services/driverService.js";
import { success, fail } from "./controllerHelper.js";
import { driverIdParamSchema } from "../validation/common.schema.js";
const validationMessage = (issues) => issues.map((i) => i.message).join(", ") || "Invalid input";
export function getAvailableDriversController(req, res, next) {
    try {
        const drivers = getAvailableDrivers();
        return success(res, drivers, "Drivers listed");
    }
    catch (err) {
        return fail(res, "UNKNOWN_ERROR", err.message, 500);
    }
}
export function getDriverController(req, res, next) {
    try {
        const parsed = driverIdParamSchema.safeParse(req.params);
        if (!parsed.success) {
            return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
        }
        const driver = getDriver(parsed.data.driverId);
        if (!driver)
            return fail(res, "NOT_FOUND", "Driver not found", 404);
        return success(res, driver, "Driver fetched");
    }
    catch (err) {
        return fail(res, "UNKNOWN_ERROR", err.message, 500);
    }
}
