import { NextResponse } from "next/server"
import { TEAMS } from "@/lib/teams"

export async function GET() {
  return NextResponse.json(TEAMS, {
    headers: { "Cache-Control": "public, max-age=3600" }, // simple caching
  })
}
