const BERLIN_TZ = "Europe/Berlin";

const BERLIN_WEEKDAY: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6
};

export function getBerlinDayOfWeek(date = new Date()): number {
  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone: BERLIN_TZ,
    weekday: "short"
  }).format(date);
  return BERLIN_WEEKDAY[weekday] ?? date.getDay();
}

export function getBerlinTimeString(date = new Date()): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: BERLIN_TZ,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(date);
}

export function isWithinBranchHours(openTime: string, closeTime: string, time: string): boolean {
  return time >= openTime && time <= closeTime;
}

/** UTC instant for a Berlin local date/time (HH:mm on ymd). */
export function berlinLocalToUtc(ymd: string, hour: number, minute: number): Date {
  const start = berlinDayStartUtc(ymd);
  return new Date(start.getTime() + hour * 60 * 60 * 1000 + minute * 60 * 1000);
}

export function berlinYmd(date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: BERLIN_TZ }).format(date);
}

export function berlinDateLabel(date = new Date()): string {
  return new Intl.DateTimeFormat("de-DE", {
    timeZone: BERLIN_TZ,
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(date);
}

/** UTC instant when the given Berlin calendar day starts (00:00). */
export function berlinDayStartUtc(ymd: string): Date {
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
  const end = berlinDayStartUtc(
    new Intl.DateTimeFormat("en-CA", { timeZone: BERLIN_TZ }).format(
      new Date(start.getTime() + 26 * 60 * 60 * 1000)
    )
  );
  return { start, end, ymd, dateLabel: berlinDateLabel(now) };
}

export function isWithinBerlinToday(createdAt: Date | string, now = new Date()): boolean {
  const { start, end } = getBerlinTodayRange(now);
  const ts = new Date(createdAt).getTime();
  return ts >= start.getTime() && ts < end.getTime();
}
