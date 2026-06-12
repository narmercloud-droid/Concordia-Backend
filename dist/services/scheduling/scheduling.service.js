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
    for (let dayOffset = 0; dayOffset <= daysAhead; dayOffset++) {
        const probe = new Date(now.getTime() + dayOffset * 24 * 60 * 60 * 1000);
        const ymd = berlinYmd(probe);
        const dayOfWeek = getBerlinDayOfWeek(probe);
        const hours = await prisma.branchHours.findUnique({
            where: { branchId_dayOfWeek: { branchId, dayOfWeek } }
        });
        if (!hours || (hours.openTime === "00:00" && hours.closeTime === "00:00"))
            continue;
        const open = toMinutes(hours.openTime);
        const close = toMinutes(hours.closeTime);
        for (let t = open; t < close; t += 30) {
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
