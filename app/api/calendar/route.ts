import { NextResponse } from "next/server"
import { buildMonth } from "@/lib/calendar"
import { defaultCycleStartDate } from "@/config/rotation"

const cache = new Map<string, any>() // simple in-memory cache

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const year = Number(searchParams.get("year"))
  const month = Number(searchParams.get("month"))
  const startDate = searchParams.get("startDate") || defaultCycleStartDate

  if (!year || !month) {
    return NextResponse.json({ error: "Missing year or month" }, { status: 400 })
  }

  const key = `${year}-${month}-${startDate}`
  if (cache.has(key)) {
    return NextResponse.json(cache.get(key), { headers: { "Cache-Control": "public, max-age=600" } })
  }

  const data = buildMonth(year, month, startDate)
  cache.set(key, data)
  return NextResponse.json(data, { headers: { "Cache-Control": "public, max-age=600" } })
}
