import { prisma } from "../../prisma/client.js";
function toMinutes(timeStr) {
    const [h, m] = timeStr.split(":").map(Number);
    return h * 60 + m;
}
export async function generateTimeSlots(branchId, daysAhead = 3) {
    const slots = [];
    const now = new Date();
    for (let dayOffset = 0; dayOffset <= daysAhead; dayOffset++) {
        const date = new Date(now);
        date.setDate(date.getDate() + dayOffset);
        const dayOfWeek = date.getDay();
        const hours = await prisma.branchHours.findUnique({
            where: { branchId_dayOfWeek: { branchId, dayOfWeek } }
        });
        if (!hours || hours.openTime === "00:00" && hours.closeTime === "00:00")
            continue;
        const open = toMinutes(hours.openTime);
        const close = toMinutes(hours.closeTime);
        for (let t = open; t < close; t += 30) {
            const slot = new Date(date);
            slot.setHours(Math.floor(t / 60), t % 60, 0, 0);
            if (slot <= now)
                continue;
            slots.push({
                label: slot.toLocaleString("de-DE", {
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
    const day = scheduledFor.getDay();
    const hours = await prisma.branchHours.findUnique({
        where: { branchId_dayOfWeek: { branchId, dayOfWeek: day } }
    });
    if (!hours || (hours.openTime === "00:00" && hours.closeTime === "00:00")) {
        return false;
    }
    const minutes = scheduledFor.getHours() * 60 + scheduledFor.getMinutes();
    const open = toMinutes(hours.openTime);
    const close = toMinutes(hours.closeTime);
    return minutes >= open && minutes <= close;
}
