const BERLIN_TZ = "Europe/Berlin";
export function berlinYmd(date = new Date()) {
    return new Intl.DateTimeFormat("en-CA", { timeZone: BERLIN_TZ }).format(date);
}
export function berlinDateLabel(date = new Date()) {
    return new Intl.DateTimeFormat("de-DE", {
        timeZone: BERLIN_TZ,
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    }).format(date);
}
/** UTC instant when the given Berlin calendar day starts (00:00). */
export function berlinDayStartUtc(ymd) {
    let probe = new Date(`${ymd}T12:00:00Z`);
    for (let i = 0; i < 72; i++) {
        const datePart = new Intl.DateTimeFormat("en-CA", { timeZone: BERLIN_TZ }).format(probe);
        const timePart = new Intl.DateTimeFormat("en-GB", {
            timeZone: BERLIN_TZ,
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
        }).format(probe);
        if (datePart === ymd && timePart === "00:00") {
            return probe;
        }
        probe = new Date(probe.getTime() - 60 * 60 * 1000);
    }
    return new Date(`${ymd}T22:00:00Z`);
}
export function getBerlinTodayRange(now = new Date()) {
    const ymd = berlinYmd(now);
    const start = berlinDayStartUtc(ymd);
    const end = berlinDayStartUtc(new Intl.DateTimeFormat("en-CA", { timeZone: BERLIN_TZ }).format(new Date(start.getTime() + 26 * 60 * 60 * 1000)));
    return { start, end, ymd, dateLabel: berlinDateLabel(now) };
}
export function isWithinBerlinToday(createdAt, now = new Date()) {
    const { start, end } = getBerlinTodayRange(now);
    const ts = new Date(createdAt).getTime();
    return ts >= start.getTime() && ts < end.getTime();
}
