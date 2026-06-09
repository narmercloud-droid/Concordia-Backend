import express from "express";
const { Router } = express;
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = Router();
// Path to store JSON data (writable dir — not "data.js")
const dataPath = path.join(process.cwd(), "data");
const hoursFile = path.join(dataPath, "opening-hours.tson");
const holidayOverridesFile = path.join(dataPath, "holiday-overrides.tson");
const zonesFile = path.join(dataPath, "delivery-zones.tson");
// Ensure data folder exists
if (!fs.existsSync(dataPath)) {
    fs.mkdirSync(dataPath, { recursive: true });
}
function loadHolidayOverrides() {
    if (!fs.existsSync(holidayOverridesFile))
        return [];
    try {
        return JSON.parse(fs.readFileSync(holidayOverridesFile, "utf8")) || [];
    }
    catch (_err) {
        void _err;
        return [];
    }
}
function saveHolidayOverrides(overrides) {
    fs.writeFileSync(holidayOverridesFile, JSON.stringify(overrides, null, 2));
}
function isValidDateString(value) {
    if (typeof value !== "string")
        return false;
    return /^\d{4}-\d{2}-\d{2}$/.test(value);
}
function validateHolidayOverridePayload(payload) {
    if (!payload || typeof payload !== "object")
        return "Invalid holiday override payload.";
    if (!payload.branchId || typeof payload.branchId !== "string")
        return "branchId is required.";
    if (!payload.date || !isValidDateString(payload.date))
        return "date must be a valid YYYY-MM-DD string.";
    if (payload.isClosed !== undefined && typeof payload.isClosed !== "boolean")
        return "isClosed must be a boolean.";
    if (payload.isClosed)
        return null;
    if (payload.open === undefined && payload.close === undefined && payload.copySourceDay === undefined && payload.action !== "delete") {
        return "open and close times are required unless the override closes the branch.";
    }
    if (payload.open !== undefined && typeof payload.open !== "string")
        return "open must be a time string.";
    if (payload.close !== undefined && typeof payload.close !== "string")
        return "close must be a time string.";
    return null;
}
// ----------------------
// Opening Hours
// ----------------------
const BRANCHES_CONFIG = path.join(__dirname, "../config/branches.json");
const WEEK_DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
const VALID_DAYS = new Set(WEEK_DAYS);
function loadAllowedBranches() {
    try {
        const raw = fs.readFileSync(BRANCHES_CONFIG, "utf8");
        const cfg = JSON.parse(raw);
        return Object.keys(cfg);
    }
    catch (_err) {
        void _err;
        return [];
    }
}
function normalizeDay(day) {
    if (typeof day !== "string")
        return null;
    const d = day.toLowerCase().trim();
    if (VALID_DAYS.has(d))
        return d;
    return null;
}
function isValidDay(day) {
    return normalizeDay(day) !== null;
}
function isValidTime(t) {
    if (typeof t !== "string")
        return false;
    const m = t.match(/^(\d{1,2}):(\d{2})$/);
    if (!m)
        return false;
    const hh = parseInt(m[1], 10);
    const mm = parseInt(m[2], 10);
    return hh >= 0 && hh <= 23 && mm >= 0 && mm <= 59;
}
function makeWeeklyHours(overrides = {}) {
    return WEEK_DAYS.map((day) => {
        const entry = overrides[day];
        if (entry && typeof entry === "object") {
            return {
                day,
                open: entry.open ?? "09:00",
                close: entry.close ?? "18:00",
                closed: typeof entry.closed === 'boolean' ? entry.closed : false
            };
        }
        return { day, open: "09:00", close: "18:00", closed: false };
    });
}
function sortWeeklyHours(hours) {
    return [...hours]
        .map((h) => ({ ...h, day: normalizeDay(h.day) }))
        .filter((h) => h.day !== null)
        .sort((a, b) => WEEK_DAYS.indexOf(a.day) - WEEK_DAYS.indexOf(b.day));
}
function validateUpdateDays(days) {
    if (!Array.isArray(days))
        return "updateDays must be an array.";
    if (days.length === 0)
        return "updateDays cannot be empty.";
    for (const day of days) {
        if (!isValidDay(day))
            return `Invalid day value in updateDays: ${String(day)}`;
    }
    return null;
}
function shiftTimeString(time, minutesDelta) {
    const match = time.match(/^(\d{1,2}):(\d{2})$/);
    if (!match)
        return time;
    const hh = parseInt(match[1], 10);
    const mm = parseInt(match[2], 10);
    let total = hh * 60 + mm + minutesDelta;
    if (total < 0)
        total = 0;
    if (total > 23 * 60 + 59)
        total = 23 * 60 + 59;
    const newH = Math.floor(total / 60);
    const newM = total % 60;
    return `${newH.toString().padStart(2, "0")}:${newM.toString().padStart(2, "0")}`;
}
function mergePartialSchedule(currentHours, updateDays, patch) {
    const normalized = currentHours.length === 7 ? sortWeeklyHours(currentHours) : makeWeeklyHours();
    const daySet = new Set(updateDays.map(normalizeDay).filter(Boolean));
    const changedDays = [];
    const merged = normalized.map((entry) => {
        if (!daySet.has(entry.day))
            return entry;
        const next = { ...entry };
        let changed = false;
        if (typeof patch.relativeOpenMinutes === 'number' && !next.closed) {
            next.open = shiftTimeString(next.open, patch.relativeOpenMinutes);
            changed = true;
        }
        if (typeof patch.relativeCloseMinutes === 'number' && !next.closed) {
            next.close = shiftTimeString(next.close, patch.relativeCloseMinutes);
            changed = true;
        }
        if (patch.open !== undefined && patch.open !== next.open) {
            next.open = patch.open;
            next.closed = false;
            changed = true;
        }
        if (patch.close !== undefined && patch.close !== next.close) {
            next.close = patch.close;
            next.closed = false;
            changed = true;
        }
        if (patch.closed !== undefined && patch.closed !== next.closed) {
            next.closed = patch.closed;
            if (next.closed) {
                next.open = next.open || "00:00";
                next.close = next.close || "00:00";
            }
            changed = true;
        }
        if (changed) {
            changedDays.push(entry.day);
        }
        return next;
    });
    return { hours: merged, changedDays };
}
function expandStoredHours(hours) {
    if (!Array.isArray(hours))
        return null;
    if (hours.length === 1 && hours[0]?.day === "all") {
        const entry = hours[0];
        if (typeof entry.closed !== 'boolean')
            return null;
        if (!isValidTime(entry.open) || !isValidTime(entry.close))
            return null;
        return WEEK_DAYS.map((day) => ({ day, open: entry.open, close: entry.close, closed: entry.closed }));
    }
    if (hours.length === 7) {
        const normalized = hours.map((h) => ({
            day: normalizeDay(h.day),
            open: h.open,
            close: h.close,
            closed: h.closed
        }));
        if (normalized.some((h) => h.day === null))
            return null;
        const seen = new Set(normalized.map((h) => h.day));
        if (seen.size !== 7)
            return null;
        return sortWeeklyHours(normalized);
    }
    return null;
}
function getHoursArrayValidationError(hours) {
    if (!Array.isArray(hours))
        return "Hours must be an array.";
    if (hours.length !== 7)
        return "Hours must contain exactly 7 day entries.";
    const seen = new Set();
    for (const h of hours) {
        if (typeof h !== "object" || h == null)
            return "Each hours entry must be an object.";
        if (!('day' in h) || !('open' in h) || !('close' in h) || !('closed' in h)) {
            return "Each hours entry must include day, open, close, and closed.";
        }
        const normalizedDay = normalizeDay(h.day);
        if (!normalizedDay)
            return `Invalid day value: ${String(h.day)}`;
        if (seen.has(normalizedDay))
            return `Duplicate day: ${normalizedDay}`;
        seen.add(normalizedDay);
        if (typeof h.closed !== 'boolean')
            return "Closed must be a boolean.";
        if (!h.closed) {
            if (!isValidTime(h.open))
                return `Invalid time format: ${String(h.open)}`;
            if (!isValidTime(h.close))
                return `Invalid time format: ${String(h.close)}`;
        }
        else {
            if (h.open && !isValidTime(h.open))
                return `Invalid time format: ${String(h.open)}`;
            if (h.close && !isValidTime(h.close))
                return `Invalid time format: ${String(h.close)}`;
        }
    }
    if (seen.size !== 7)
        return "Hours must contain exactly one entry for each weekday.";
    return null;
}
// helper removed: _validateHoursArray is unused
function validateAndCleanBranches(rawBranches, allowed) {
    const cleaned = {};
    for (const id of allowed) {
        const entry = rawBranches[id];
        const storedHours = entry?.hours;
        const normalized = expandStoredHours(storedHours);
        cleaned[id] = { hours: normalized ?? makeWeeklyHours() };
    }
    return cleaned;
}
router.get("/opening-hours", (_req, res) => {
    let branches = {};
    const allowed = loadAllowedBranches();
    if (fs.existsSync(hoursFile)) {
        const raw = JSON.parse(fs.readFileSync(hoursFile, "utf8"));
        const cleaned = validateAndCleanBranches(raw, allowed);
        fs.writeFileSync(hoursFile, JSON.stringify(cleaned, null, 2));
        branches = cleaned;
    }
    else {
        const defaultHours = makeWeeklyHours();
        branches = {};
        for (const id of allowed) {
            branches[id] = { hours: defaultHours };
        }
        fs.writeFileSync(hoursFile, JSON.stringify(branches, null, 2));
    }
    const holidayOverrides = loadHolidayOverrides();
    res.tson({ success: true, branches, holidayOverrides });
});
router.post("/opening-hours", (req, res) => {
    const { branchId, hours, updateDays, open, close, closed, relativeOpenMinutes, relativeCloseMinutes, copySourceBranchId, copyTargetBranchId } = req.body || {};
    const allowed = loadAllowedBranches();
    if (!branchId && !copySourceBranchId && !copyTargetBranchId) {
        return res.status(400).tson({ success: false, error: "Invalid payload" });
    }
    let branches = {};
    if (fs.existsSync(hoursFile)) {
        branches = JSON.parse(fs.readFileSync(hoursFile, "utf8"));
    }
    const cleaned = validateAndCleanBranches(branches, allowed);
    if (copySourceBranchId || copyTargetBranchId) {
        const sourceId = copySourceBranchId ?? branchId;
        const targetId = copyTargetBranchId ?? branchId;
        if (!sourceId || !targetId || !allowed.includes(sourceId) || !allowed.includes(targetId)) {
            return res.status(400).tson({ success: false, error: "Invalid payload" });
        }
        cleaned[targetId] = { hours: [...cleaned[sourceId].hours] };
        fs.writeFileSync(hoursFile, JSON.stringify(cleaned, null, 2));
        return res.tson({ success: true, updated: { branchId: targetId, hours: cleaned[targetId].hours, changedDays: [...WEEK_DAYS] } });
    }
    if (!branchId) {
        return res.status(400).tson({ success: false, error: "Invalid payload" });
    }
    if (!allowed.includes(branchId)) {
        return res.status(400).tson({ success: false, error: "Invalid payload" });
    }
    if (hours) {
        const hoursError = getHoursArrayValidationError(hours);
        if (hoursError) {
            return res.status(400).tson({ success: false, error: hoursError });
        }
        const normalizedHours = sortWeeklyHours(hours);
        cleaned[branchId] = { hours: normalizedHours };
        fs.writeFileSync(hoursFile, JSON.stringify(cleaned, null, 2));
        return res.tson({ success: true, updated: { branchId, hours: normalizedHours, changedDays: [...WEEK_DAYS] } });
    }
    const updateDaysError = validateUpdateDays(updateDays);
    if (updateDaysError) {
        return res.status(400).tson({ success: false, error: updateDaysError });
    }
    if (open !== undefined && !isValidTime(open)) {
        return res.status(400).tson({ success: false, error: `Invalid time format: ${String(open)}` });
    }
    if (close !== undefined && !isValidTime(close)) {
        return res.status(400).tson({ success: false, error: `Invalid time format: ${String(close)}` });
    }
    if (closed !== undefined && typeof closed !== 'boolean') {
        return res.status(400).tson({ success: false, error: "Closed must be a boolean." });
    }
    if (open === undefined && close === undefined && closed === undefined && relativeOpenMinutes === undefined && relativeCloseMinutes === undefined) {
        return res.status(400).tson({ success: false, error: "At least one update field (open, close, closed, relativeOpenMinutes, relativeCloseMinutes) is required." });
    }
    const currentHours = cleaned[branchId].hours.length === 7 ? cleaned[branchId].hours : makeWeeklyHours();
    const partialResult = mergePartialSchedule(currentHours, updateDays, {
        open,
        close,
        closed,
        relativeOpenMinutes,
        relativeCloseMinutes
    });
    cleaned[branchId] = { hours: sortWeeklyHours(partialResult.hours) };
    fs.writeFileSync(hoursFile, JSON.stringify(cleaned, null, 2));
    res.tson({ success: true, updated: { branchId, hours: cleaned[branchId].hours, changedDays: partialResult.changedDays } });
});
router.get("/holiday-overrides", (req, res) => {
    const branchId = req.query.branchId;
    const allowed = loadAllowedBranches();
    if (branchId && !allowed.includes(branchId)) {
        return res.status(400).tson({ success: false, error: "Invalid branchId" });
    }
    const overrides = loadHolidayOverrides();
    const filtered = branchId ? overrides.filter((override) => override.branchId === branchId) : overrides;
    res.tson({ success: true, holidayOverrides: filtered });
});
router.post("/holiday-overrides", (req, res) => {
    const payload = req.body || {};
    const allowed = loadAllowedBranches();
    const error = validateHolidayOverridePayload(payload);
    if (error) {
        return res.status(400).tson({ success: false, error });
    }
    if (!allowed.includes(payload.branchId)) {
        return res.status(400).tson({ success: false, error: "Invalid branchId" });
    }
    const overrides = loadHolidayOverrides();
    const existingIndex = overrides.findIndex((item) => item.branchId === payload.branchId && item.date === payload.date);
    const overrideRecord = {
        branchId: payload.branchId,
        date: payload.date,
        open: payload.open ?? null,
        close: payload.close ?? null,
        isClosed: Boolean(payload.isClosed)
    };
    if (existingIndex >= 0) {
        overrides[existingIndex] = overrideRecord;
    }
    else {
        overrides.push(overrideRecord);
    }
    saveHolidayOverrides(overrides);
    res.tson({ success: true, holidayOverride: overrideRecord });
});
router.put("/holiday-overrides", (req, res) => {
    const payload = req.body || {};
    const allowed = loadAllowedBranches();
    const error = validateHolidayOverridePayload(payload);
    if (error) {
        return res.status(400).tson({ success: false, error });
    }
    if (!allowed.includes(payload.branchId)) {
        return res.status(400).tson({ success: false, error: "Invalid branchId" });
    }
    const overrides = loadHolidayOverrides();
    const existingIndex = overrides.findIndex((item) => item.branchId === payload.branchId && item.date === payload.date);
    if (existingIndex < 0) {
        return res.status(404).tson({ success: false, error: "Holiday override not found." });
    }
    const overrideRecord = {
        branchId: payload.branchId,
        date: payload.date,
        open: payload.open ?? overrides[existingIndex].open,
        close: payload.close ?? overrides[existingIndex].close,
        isClosed: payload.isClosed ?? overrides[existingIndex].isClosed
    };
    overrides[existingIndex] = overrideRecord;
    saveHolidayOverrides(overrides);
    res.tson({ success: true, holidayOverride: overrideRecord });
});
router.delete("/holiday-overrides", (req, res) => {
    const payload = req.body || {};
    const allowed = loadAllowedBranches();
    if (!payload.branchId || !payload.date) {
        return res.status(400).tson({ success: false, error: "branchId and date are required." });
    }
    if (!allowed.includes(payload.branchId)) {
        return res.status(400).tson({ success: false, error: "Invalid branchId" });
    }
    const overrides = loadHolidayOverrides();
    const remaining = overrides.filter((item) => !(item.branchId === payload.branchId && item.date === payload.date));
    saveHolidayOverrides(remaining);
    res.tson({ success: true, holidayOverride: { branchId: payload.branchId, date: payload.date } });
});
// ----------------------
// Delivery Zones
// ----------------------
router.get("/delivery-zones", (_req, res) => {
    if (!fs.existsSync(zonesFile)) {
        return res.tson({ success: true, zones: [] });
    }
    const data = JSON.parse(fs.readFileSync(zonesFile, "utf8"));
    res.tson({ success: true, zones: data });
});
router.post("/delivery-zones", (req, res) => {
    fs.writeFileSync(zonesFile, JSON.stringify(req.body, null, 2));
    res.tson({ success: true, updated: req.body });
});
router.get("/me", (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).tson({ error: "Unauthorized" });
    }
    res.tson({ user });
});
// ----------------------
export default router;
