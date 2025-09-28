"use client"

import type { CalendarDay } from "@/lib/types"

interface Props {
  year: number
  month: number // 1-12
  days: CalendarDay[]
  onSelectDay: (day: CalendarDay) => void
}

// Compute leading blanks for first weekday alignment (Mon..Sun)
function getLeadingBlanks(year: number, month: number): number {
  const first = new Date(Date.UTC(year, month - 1, 1))
  const js = first.getUTCDay() // 0 Sun .. 6 Sat
  const iso = (js + 6) % 7 // 0 Mon .. 6 Sun
  return iso // number of blanks before day 1
}

export function CalendarGrid({ year, month, days, onSelectDay }: Props) {
  const blanks = getLeadingBlanks(year, month)
  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  return (
    <section aria-label="Site visit schedule calendar" className="p-4">
      <div className="grid grid-cols-7 gap-2 text-center text-xs text-muted-foreground mb-2">
        {weekdays.map((w) => (
          <div key={w} aria-hidden>
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2" role="grid" aria-label="Site visit schedule grid">
        {Array.from({ length: blanks }).map((_, i) => (
          <div key={`blank-${i}`} aria-hidden className="p-3 rounded-md" />
        ))}
        {days.map((d) => {
          const dayNum = Number(d.date.split("-")[2])
          const isHoliday = d.team === "No Visit"
          const displayTeam = d.team.replace(' - ', ' ')
          
          return (
            <button
              key={d.date}
              onClick={() => onSelectDay(d)}
              className={`p-2 sm:p-3 rounded-md border text-left focus:outline-none focus:ring-2 focus:ring-ring min-h-[5rem] sm:min-h-[6rem] overflow-hidden flex flex-col ${
                isHoliday 
                  ? 'bg-muted/30 border-muted text-muted-foreground' 
                  : 'bg-background hover:bg-accent/50'
              }`}
              aria-label={`Day ${dayNum}, ${isHoliday ? 'holiday - no site visits' : `site visit team ${displayTeam}`}`}
            >
              <div className="flex items-center justify-between mb-1 w-full">
                <span className="text-sm font-medium">{dayNum}</span>
                {isHoliday && (
                  <span className="text-xs text-muted-foreground">🏠</span>
                )}
              </div>
              <div className={`text-[9px] leading-snug flex-1 overflow-hidden break-words ${
                isHoliday 
                  ? 'text-muted-foreground font-medium text-center flex items-center justify-center' 
                  : 'text-muted-foreground'
              }`}>
                {isHoliday ? 'Holiday' : displayTeam}
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}
