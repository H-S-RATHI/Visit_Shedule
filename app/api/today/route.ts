import { NextResponse } from "next/server"
import { computeTeamForDate } from "@/lib/calendar"
import { defaultCycleStartDate } from "@/config/rotation"

function formatUtc(date: Date): string {
  const y = date.getUTCFullYear()
  const m = String(date.getUTCMonth() + 1).padStart(2, "0")
  const d = String(date.getUTCDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

export async function GET() {
  // Normalize "today" to UTC date
  const now = new Date()
  const utcToday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
  const { team, teamIndex } = computeTeamForDate(utcToday, defaultCycleStartDate)
  return NextResponse.json(
    {
      date: formatUtc(utcToday),
      team: team.name,
      teamId: teamIndex,
      members: team.members,
    },
    { headers: { "Cache-Control": "no-store" } },
  )
}
