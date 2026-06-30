// Authentic Swahilipot FM Schedule
// Data source: https://www.swahilipotfm.co.ke/

export interface ShowSlot {
  start: string; // HH:MM format
  end: string | null; // HH:MM format or null for ongoing
  show: string;
}

export interface WeeklySchedule {
  [day: string]: ShowSlot[];
}

export const SWAHILIPOT_SCHEDULE: WeeklySchedule = {
  monday: [
    { start: "06:00", end: "10:00", show: "The Breakfast Club" },
    { start: "10:00", end: "11:00", show: "Kick Off" },
    { start: "11:00", end: "14:00", show: "Swahilipot Cafe" },
    { start: "14:00", end: "15:00", show: "Vibe with Kams in Swahilipot Mixes" },
    { start: "15:00", end: "19:00", show: "Swahilipot Drive Show" },
    { start: "19:00", end: "21:00", show: "Beyond The Ballot" },
    { start: "21:00", end: null, show: "The Night Shift" },
  ],
  tuesday: [
    { start: "06:00", end: "10:00", show: "The Breakfast Club" },
    { start: "10:00", end: "11:00", show: "Kick Off" },
    { start: "11:00", end: "14:00", show: "Swahilipot Cafe" },
    { start: "14:00", end: "15:00", show: "Vibe with Kams in Swahilipot Mixes" },
    { start: "15:00", end: "19:00", show: "Swahilipot Drive Show" },
    { start: "19:00", end: "21:00", show: "Beyond The Ballot" },
    { start: "21:00", end: null, show: "The Night Shift" },
  ],
  wednesday: [
    { start: "06:00", end: "10:00", show: "The Breakfast Club" },
    { start: "10:00", end: "11:00", show: "Kick Off" },
    { start: "11:00", end: "14:00", show: "Swahilipot Cafe" },
    { start: "14:00", end: "15:00", show: "Vibe with Kams in Swahilipot Mixes" },
    { start: "15:00", end: "19:00", show: "Swahilipot Drive Show" },
    { start: "19:00", end: "21:00", show: "Beyond The Ballot" },
    { start: "21:00", end: null, show: "The Night Shift" },
  ],
  thursday: [
    { start: "06:00", end: "10:00", show: "The Breakfast Club" },
    { start: "10:00", end: "11:00", show: "Kick Off" },
    { start: "11:00", end: "14:00", show: "Swahilipot Cafe" },
    { start: "14:00", end: "15:00", show: "Vibe with Kams in Swahilipot Mixes" },
    { start: "15:00", end: "19:00", show: "Swahilipot Drive Show" },
    { start: "19:00", end: "21:00", show: "Beyond The Ballot" },
    { start: "21:00", end: null, show: "The Night Shift" },
  ],
  friday: [
    { start: "06:00", end: "10:00", show: "The Breakfast Club" },
    { start: "10:00", end: "11:00", show: "Request Hour" },
    { start: "11:00", end: "14:00", show: "Swahilipot Cafe" },
    { start: "14:00", end: "15:00", show: "Vibe with Kams in Swahilipot Mixes" },
    { start: "15:00", end: "19:00", show: "Swahilipot Drive Show" },
    { start: "19:00", end: "21:00", show: "Beyond The Ballot" },
    { start: "21:00", end: null, show: "The Night Shift" },
  ],
  saturday: [
    { start: "08:00", end: "10:00", show: "Mikuki ya Maneno" },
    { start: "10:00", end: "12:00", show: "Teenz Connect" },
    { start: "12:00", end: "15:00", show: "Swahilipot Aroma" },
    { start: "15:00", end: "19:00", show: "Kick Off" },
    { start: "19:00", end: null, show: "Saturday Night Wave" },
  ],
  sunday: [
    { start: "11:00", end: null, show: "Vibes and Music" },
  ],
};

// Utility functions
export function getFormattedDay(): string {
  const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  return days[new Date().getDay()];
}

export function getFormattedTime(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

export function timeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
}

export function getCurrentShow(): ShowSlot | null {
  const day = getFormattedDay();
  const currentTime = getFormattedTime();
  const currentMinutes = timeToMinutes(currentTime);

  const todaySchedule = SWAHILIPOT_SCHEDULE[day] || [];

  for (const slot of todaySchedule) {
    const startMinutes = timeToMinutes(slot.start);
    const endMinutes = slot.end ? timeToMinutes(slot.end) : 24 * 60; // Midnight if null

    if (currentMinutes >= startMinutes && currentMinutes < endMinutes) {
      return slot;
    }
  }

  return null;
}

export function getUpcomingShows(count: number = 5): ShowSlot[] {
  const day = getFormattedDay();
  const currentTime = getFormattedTime();
  const currentMinutes = timeToMinutes(currentTime);

  const todaySchedule = SWAHILIPOT_SCHEDULE[day] || [];
  const upcoming: ShowSlot[] = [];

  // Get remaining shows today
  for (const slot of todaySchedule) {
    const startMinutes = timeToMinutes(slot.start);
    if (startMinutes > currentMinutes) {
      upcoming.push(slot);
      if (upcoming.length >= count) return upcoming;
    }
  }

  // If not enough, get shows from next days
  const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const currentDayIndex = days.indexOf(day);

  for (let i = 1; i < 7 && upcoming.length < count; i++) {
    const nextDayIndex = (currentDayIndex + i) % 7;
    const nextDay = days[nextDayIndex];
    const nextDaySchedule = SWAHILIPOT_SCHEDULE[nextDay] || [];

    for (const slot of nextDaySchedule) {
      upcoming.push(slot);
      if (upcoming.length >= count) return upcoming;
    }
  }

  return upcoming.slice(0, count);
}

export function getAllUniqueShows(): string[] {
  const shows = new Set<string>();

  Object.values(SWAHILIPOT_SCHEDULE).forEach((daySchedule) => {
    daySchedule.forEach((slot) => {
      shows.add(slot.show);
    });
  });

  return Array.from(shows).sort();
}
