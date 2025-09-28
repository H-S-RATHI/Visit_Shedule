"use client"

import { useCallback, useMemo, useState } from "react"
import useSWR from "swr"
import type { CalendarResponse, CalendarDay } from "@/lib/types"
import { TodayCard } from "@/components/today-card"
import { CalendarGrid } from "@/components/calendar-grid"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

function getTodayYm(): { y: number; m: number } {
  const now = new Date()
  return { y: now.getUTCFullYear(), m: now.getUTCMonth() + 1 }
}

function monthLabel(y: number, m: number) {
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleString("en-US", { month: "long", year: "numeric", timeZone: "UTC" })
}

export default function HomePage() {
  const { y: ty, m: tm } = getTodayYm()
  const [year, setYear] = useState(ty)
  const [month, setMonth] = useState(tm)
  const [selected, setSelected] = useState<CalendarDay | null>(null)

  const calUrl = useMemo(() => `/api/calendar?year=${year}&month=${month}`, [year, month])

  const { data: cal } = useSWR<CalendarResponse>(calUrl, fetcher)

  const onPrev = useCallback(() => {
    const d = new Date(Date.UTC(year, month - 2, 1))
    setYear(d.getUTCFullYear())
    setMonth(d.getUTCMonth() + 1)
  }, [year, month])

  const onNext = useCallback(() => {
    const d = new Date(Date.UTC(year, month, 1))
    setYear(d.getUTCFullYear())
    setMonth(d.getUTCMonth() + 1)
  }, [year, month])

  const onGoToToday = useCallback(() => {
    const { y, m } = getTodayYm()
    setYear(y)
    setMonth(m)
  }, [])


  return (
    <main className="min-h-dvh bg-background text-foreground">
      <TodayCard onGoToToday={onGoToToday} />

      <header className="p-4 flex items-center justify-between gap-2">
        <button
          className="rounded-md px-2 py-2 sm:px-3 bg-secondary text-secondary-foreground text-sm flex-shrink-0"
          onClick={onPrev}
          aria-label="Prev month"
        >
          <span className="hidden sm:inline">Prev month</span>
          <span className="sm:hidden">‹ Prev</span>
        </button>
        <h1 className="text-lg sm:text-xl font-semibold text-center flex-1 min-w-0 truncate px-2">{monthLabel(year, month)}</h1>
        <button
          className="rounded-md px-2 py-2 sm:px-3 bg-secondary text-secondary-foreground text-sm flex-shrink-0"
          onClick={onNext}
          aria-label="Next month"
        >
          <span className="hidden sm:inline">Next month</span>
          <span className="sm:hidden">Next ›</span>
        </button>
      </header>


      {cal && (
        <>
          <CalendarGrid year={cal.year} month={cal.month} days={cal.days} onSelectDay={(d) => setSelected(d)} />
        </>
      )}

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent aria-describedby="team-details">
          <DialogHeader>
            <DialogTitle>
              {selected
                ? `${selected.team === "No Visit" ? "Weekend Holiday" : "Site Visit Team"} — ${new Date(selected.date).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
                : "Site Visit Team"}
            </DialogTitle>
            <DialogDescription id="team-details">
              {selected ? (
                selected.team === "No Visit" ? (
                  <div className="mt-2 space-y-2 text-center">
                    <div className="text-6xl mb-4">🏠</div>
                    <p className="font-medium text-lg">Weekend Holiday</p>
                    <p className="text-sm text-muted-foreground">
                      No site visits are scheduled on weekends. Our property sales team takes weekends off to rest and recharge.
                    </p>
                  </div>
                ) : (
                  <div className="mt-2 space-y-2">
                    <p className="font-medium break-words">{selected.team.replace(' - ', ' ')}</p>
                    <div className="text-sm text-muted-foreground">
                      <p className="font-medium mb-1">Site Visit Representatives:</p>
                      <div className="flex flex-wrap gap-2">
                        {selected.members.map((member, index) => (
                          <span
                            key={index}
                            className="inline-block bg-muted px-2 py-1 rounded-md text-xs break-all"
                          >
                            {member}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              ) : null}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </main>
  )
}

