import { GET as getCalendar } from "@/app/api/calendar/route"

function makeRequest(year: number, month: number) {
  const url = new URL("http://localhost/api/calendar")
  url.searchParams.set("year", String(year))
  url.searchParams.set("month", String(month))
  return new Request(url.toString())
}

describe("GET /api/calendar", () => {
  test("returns calendar days for month with team assignments", async () => {
    const res = await getCalendar(makeRequest(2025, 10))
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(Array.isArray(data.days)).toBe(true)
    // October 2025 has 31 days
    expect(data.days.length).toBe(31)
    // Each day should have a team and teamId
    expect(data.days[0]).toHaveProperty("team")
    expect(data.days[0]).toHaveProperty("teamId")
  })
})
