import { TEAMS, HOLIDAY_TEAM } from "./teams"
import { defaultCycleStartDate } from "@/config/rotation"
import type { CalendarDay, CalendarResponse, MonthMeta, Team } from "./types"

// Normalize a JS Date to UTC midnight (to avoid timezone/DST issues)
function toUtcDate(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
}

// Parse YYYY-MM-DD into a UTC Date at midnight
function parseIsoToUtc(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number)
  return new Date(Date.UTC(y, m - 1, d))
}

// Format date to YYYY-MM-DD from a UTC Date
function formatUtc(date: Date): string {
  const y = date.getUTCFullYear()
  const m = String(date.getUTCMonth() + 1).padStart(2, "0")
  const d = String(date.getUTCDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

// ISO weekday index 0..6 where 0 = Monday, ..., 6 = Sunday.
// JS getUTCDay() returns 0=Sunday..6=Saturday, so convert.
export function getIsoWeekdayIndex(date: Date): number {
  const js = date.getUTCDay() // 0..6 with 0=Sunday
  return (js + 6) % 7 // 0=Monday, 6=Sunday
}

export interface ComputeTeamResult {
  team: Team
  teamIndex: number
}

/**
 * Rotation algorithm (updated for weekdays only):
 * - teams = [T0..T4] for weekdays only (Mon-Fri)
 * - weekends (Sat-Sun) = Holiday/No Visit
 * - startDate = configurable cycle start date (default Monday 2025-09-29)
 * - daysSinceStart = floor((d - startDate) / dayMs)
 * - weekIndex = floor(daysSinceStart / 7)
 * - weekdayIndex = ISO weekday 0..6 (0=Mon, 6=Sun)
 * - if weekend (Sat=5, Sun=6): return HOLIDAY_TEAM
 * - if weekday (0-4): teamIndex = (weekdayIndex + weekIndex) % teams.length
 * - assigned team = teams[teamIndex]
 */
export function computeTeamForDate(
  date: Date,
  startDateStr: string = defaultCycleStartDate,
  teams: Team[] = TEAMS,
): ComputeTeamResult {
  const d = toUtcDate(date)
  const weekdayIndex = getIsoWeekdayIndex(d)
  
  // Check if it's weekend (Saturday=5, Sunday=6)
  if (weekdayIndex === 5 || weekdayIndex === 6) {
    return { team: HOLIDAY_TEAM, teamIndex: -1 }
  }
  
  // For weekdays (0-4), calculate team rotation
  const start = parseIsoToUtc(startDateStr)
  const dayMs = 24 * 60 * 60 * 1000
  const daysSinceStart = Math.floor((d.getTime() - start.getTime()) / dayMs)
  const weekIndex = Math.floor(daysSinceStart / 7)
  
  // Only assign teams to weekdays (0-4), so we have 5 teams for 5 weekdays
  const teamIndex = (((weekdayIndex + weekIndex) % teams.length) + teams.length) % teams.length
  return { team: teams[teamIndex], teamIndex }
}

export function buildMonth(
  year: number,
  month: number, // 1-12
  startDateStr: string = defaultCycleStartDate,
  teams: Team[] = TEAMS,
): CalendarResponse {
  const first = new Date(Date.UTC(year, month - 1, 1))
  const last = new Date(Date.UTC(year, month, 0)) // last day of month
  const days: CalendarDay[] = []
  for (let d = first; d <= last; d = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1))) {
    const { team, teamIndex } = computeTeamForDate(d, startDateStr, teams)
    days.push({
      date: formatUtc(d),
      team: team.name,
      teamId: teamIndex,
      members: team.members,
    })
  }
  return { year, month, days }
}

export function getPrevNextMonths(year: number, month: number, n = 5): { previous: MonthMeta[]; next: MonthMeta[] } {
  const prev: MonthMeta[] = []
  const next: MonthMeta[] = []
  // previous months, most recent first (e.g., Sep 2025, Aug 2025...)
  for (let i = 1; i <= n; i++) {
    const d = new Date(Date.UTC(year, month - 1 - i, 1))
    prev.push({
      year: d.getUTCFullYear(),
      month: d.getUTCMonth() + 1,
      label: d.toLocaleString("en-US", { month: "short", year: "numeric", timeZone: "UTC" }),
    })
  }
  // next months (e.g., Nov 2025, Dec 2025...)
  for (let i = 1; i <= n; i++) {
    const d = new Date(Date.UTC(year, month - 1 + i, 1))
    next.push({
      year: d.getUTCFullYear(),
      month: d.getUTCMonth() + 1,
      label: d.toLocaleString("en-US", { month: "short", year: "numeric", timeZone: "UTC" }),
    })
  }
  return { previous: prev, next }
}
