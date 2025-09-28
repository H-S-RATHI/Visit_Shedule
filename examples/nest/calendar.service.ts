import { Injectable } from "@nestjs/common"

// Same pairings as the Next.js app:
const TEAMS = [
  { id: 0, name: "Devesh - Satyam", members: ["Devesh", "Satyam"] },
  { id: 1, name: "Uday - Amit", members: ["Uday", "Amit"] },
  { id: 2, name: "Nihal - Karan", members: ["Nihal", "Karan"] },
  { id: 3, name: "Revu - Gravit", members: ["Revu", "Gravit"] },
  { id: 4, name: "Dinesh Bhatt - Daksh", members: ["Dinesh Bhatt", "Daksh"] },
]

function toUtcDate(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
}
function parseIsoToUtc(iso: string) {
  const [y, m, d] = iso.split("-").map(Number)
  return new Date(Date.UTC(y, m - 1, d))
}
function getIsoWeekdayIndex(date: Date) {
  return (date.getUTCDay() + 6) % 7
}
function formatUtc(date: Date) {
  const y = date.getUTCFullYear()
  const m = String(date.getUTCMonth() + 1).padStart(2, "0")
  const d = String(date.getUTCDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

@Injectable()
export class CalendarService {
  private readonly defaultStartDate = "2025-09-29" // Monday

  computeTeamForDate(date: Date, startDateStr = this.defaultStartDate) {
    const d = toUtcDate(date)
    const start = parseIsoToUtc(startDateStr)
    const dayMs = 24 * 60 * 60 * 1000
    const daysSinceStart = Math.floor((d.getTime() - start.getTime()) / dayMs)
    const weekIndex = Math.floor(daysSinceStart / 7)
    const weekdayIndex = getIsoWeekdayIndex(d)
    const teamIndex = (((weekdayIndex + weekIndex) % TEAMS.length) + TEAMS.length) % TEAMS.length
    return { ...TEAMS[teamIndex], teamId: teamIndex }
  }

  getToday() {
    const now = new Date()
    const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
    const assigned = this.computeTeamForDate(today)
    return { date: formatUtc(today), team: assigned.name, teamId: assigned.teamId, members: assigned.members }
  }

  getCalendar(year: number, month: number, startDate?: string) {
    const startDateStr = startDate || this.defaultStartDate
    const first = new Date(Date.UTC(year, month - 1, 1))
    const last = new Date(Date.UTC(year, month, 0))
    const days = []
    for (let d = first; d <= last; d = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1))) {
      const assigned = this.computeTeamForDate(d, startDateStr)
      days.push({ date: formatUtc(d), team: assigned.name, teamId: assigned.teamId, members: assigned.members })
    }
    return { year, month, days }
  }
}
