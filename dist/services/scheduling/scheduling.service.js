import { prisma } from "../../prisma/client.js";
import { berlinLocalToUtc, berlinYmd, getBerlinDayOfWeek, getBerlinTimeString, isWithinBranchHours } from "../../utils/berlinTime.js";
function toMinutes(timeStr) {
    const [h, m] = timeStr.split(":").map(Number);
    return h * 60 + m;
}
export async function isBranchOpenNow(branchId, now = new Date()) {
    const branchConfig = await prisma.branchConfig.findUnique({
        where: { branchId }
    });
    const config = branchConfig?.configJson ?? {};
    const status = String(config.status ?? "live");
    if (status !== "live")
        return false;
    if (Boolean(config.ordersPaused))
        return false;
    const day = getBerlinDayOfWeek(now);
    const hours = await prisma.branchHours.findUnique({
        where: { branchId_dayOfWeek: { branchId, dayOfWeek: day } }
    });
    if (!hours || (hours.openTime === "00:00" && hours.closeTime === "00:00")) {
        return false;
    }
    const time = getBerlinTimeString(now);
    return isWithinBranchHours(hours.openTime, hours.closeTime, time);
}
export async function generateTimeSlots(branchId, daysAhead = 3) {
    const slots = [];
    const now = new Date();
    const dayOffsets = Array.from({ length: daysAhead + 1 }, (_, i) => i);
    const probes = dayOffsets.map((dayOffset) => new Date(now.getTime() + dayOffset * 24 * 60 * 60 * 1000));
    const dayOfWeeks = [...new Set(probes.map((probe) => getBerlinDayOfWeek(probe)))];
    const hoursRows = await prisma.branchHours.findMany({
        where: { branchId, dayOfWeek: { in: dayOfWeeks } }
    });
    const hoursByDay = new Map(hoursRows.map((row) => [row.dayOfWeek, row]));
    for (const probe of probes) {
        const ymd = berlinYmd(probe);
        const dayOfWeek = getBerlinDayOfWeek(probe);
        const hours = hoursByDay.get(dayOfWeek);
        if (!hours || (hours.openTime === "00:00" && hours.closeTime === "00:00"))
            continue;
        const open = toMinutes(hours.openTime);
        const close = toMinutes(hours.closeTime);
        for (let t = open; t < close; t += 15) {
            const slot = berlinLocalToUtc(ymd, Math.floor(t / 60), t % 60);
            if (slot <= now)
                continue;
            slots.push({
                label: slot.toLocaleString("de-DE", {
                    timeZone: "Europe/Berlin",
                    weekday: "short",
                    day: "2-digit",
                    month: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit"
                }),
                value: slot.toISOString()
            });
        }
    }
    return slots;
}
export async function validateScheduledTime(branchId, scheduledFor) {
    if (scheduledFor <= new Date())
        return false;
    const day = getBerlinDayOfWeek(scheduledFor);
    const hours = await prisma.branchHours.findUnique({
        where: { branchId_dayOfWeek: { branchId, dayOfWeek: day } }
    });
    if (!hours || (hours.openTime === "00:00" && hours.closeTime === "00:00")) {
        return false;
    }
    const time = getBerlinTimeString(scheduledFor);
    return isWithinBranchHours(hours.openTime, hours.closeTime, time);
}
