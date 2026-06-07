import { createClient } from "@supabase/supabase-js";

export const SUPABASE_URL = "https://uzxsqstnjtcxvyopapuq.supabase.co";
export const SUPABASE_KEY = "sb_publishable_JlmBO1T7-SnaF8Ib4Vo4fA_alV2aTej";
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

export const SERVICES = [
  { id: "interior", name: "Interior Only", duration: "1.5 hrs", prices: { sedan: 80, suv: 95 } },
  { id: "exterior-basic", name: "Exterior Basic", duration: "1 hr", prices: { sedan: 45, suv: 45 } },
  { id: "exterior-premium", name: "Exterior Premium", duration: "1.5 hrs", prices: { sedan: 75, suv: 95 } },
  { id: "combo-basic", name: "Interior + Exterior Basic", duration: "2.5 hrs", prices: { sedan: 110, suv: 120 } },
  { id: "combo-premium", name: "Interior + Exterior Premium", duration: "3 hrs", prices: { sedan: 135, suv: 155 } },
];

export const WEEKLY_SLOTS = [
  { day: 6, label: "Saturday", times: ["8:00 AM", "11:00 AM"] },
  { day: 1, label: "Monday", times: ["4:00 PM"] },
  { day: 3, label: "Wednesday", times: ["4:00 PM"] },
];

export const STATUS_STYLES = {
  pending:   { bg: "#431407", color: "#FB923C", label: "Pending" },
  confirmed: { bg: "#1E3A5F", color: "#60A5FA", label: "Confirmed" },
  completed: { bg: "#14532D", color: "#86EFAC", label: "Completed" },
  cancelled: { bg: "#3B0000", color: "#FCA5A5", label: "Cancelled" },
  archived:  { bg: "#252525", color: "#A3A3A3", label: "Archived" },
};

export function getPriceFromBooking(b) {
  const svc = SERVICES.find(s => s.name === b.service_type);
  if (!svc) return null;
  const m = (b.notes || "").match(/\[vehicle:(sedan|suv)\]/);
  const vehicle = m ? m[1] : "sedan";
  return svc.prices[vehicle] ?? null;
}

export function cleanNotes(notes) {
  if (!notes) return null;
  return notes.replace(/^\[vehicle:(sedan|suv)\]\n?/, "").trim() || null;
}

const BLACKOUT_START = "2026-06-19";
const BLACKOUT_END   = "2026-07-14";

export function getAvailableSlots() {
  const slots = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 1; i <= 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dow = date.getDay();
    const match = WEEKLY_SLOTS.find((s) => s.day === dow);
    if (!match) continue;
    const dateStr = date.toISOString().split("T")[0];
    if (dateStr >= BLACKOUT_START && dateStr <= BLACKOUT_END) continue;
    match.times.forEach((time) => {
      slots.push({
        date: dateStr,
        displayDate: date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" }),
        time,
      });
    });
  }
  return slots;
}
