import { computeTeamForDate } from "@/lib/calendar"
import { TEAMS } from "@/lib/teams"
import { defaultCycleStartDate } from "@/config/rotation"

function utc(y: number, m: number, d: number) {
  return new Date(Date.UTC(y, m - 1, d))
}

describe("Rotation algorithm", () => {
  const start = defaultCycleStartDate // 2025-09-29 (Monday)
  const [sy, sm, sd] = start.split("-").map(Number)

  test("Monday moves to next team each week", () => {
    // Take 5 consecutive Mondays starting at start date
    const mondays = [
      utc(sy, sm, sd),
      utc(sy, sm, sd + 7),
      utc(sy, sm, sd + 14),
      utc(sy, sm, sd + 21),
      utc(sy, sm, sd + 28),
    ]
    const indices = mondays.map((d) => computeTeamForDate(d, start).teamIndex)
    // Expect 0,1,2,3,4
    expect(indices).toEqual([0, 1, 2, 3, 4])
  })

  test("Repeats after 5 weeks", () => {
    const week0 = computeTeamForDate(utc(sy, sm, sd), start).teamIndex
    const week5 = computeTeamForDate(utc(sy, sm, sd + 35), start).teamIndex
    expect(week5).toBe(week0)
  })

  test("Example team pair exists", () => {
    const names = TEAMS.map((t) => t.name)
    expect(names).toContain("Uday - Amit")
  })
})
