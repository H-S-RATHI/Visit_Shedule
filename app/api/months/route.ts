import { NextResponse } from "next/server"
import { getPrevNextMonths } from "@/lib/calendar"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const year = Number(searchParams.get("year"))
  const month = Number(searchParams.get("month"))
  if (!year || !month) return NextResponse.json({ error: "Missing year or month" }, { status: 400 })

  const { previous, next } = getPrevNextMonths(year, month, 5)
  return NextResponse.json(
    { current: { year, month }, previous, next },
    { headers: { "Cache-Control": "public, max-age=3600" } },
  )
}
