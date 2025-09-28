"use client"

import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

interface Props {
  onGoToToday: () => void
}

export function TodayCard({ onGoToToday }: Props) {
  const { data } = useSWR("/api/today", fetcher, { revalidateOnFocus: false })
  return (
    <aside
      className="sticky top-0 z-10 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b"
      aria-label="Today's site visit schedule"
    >
      <div className="p-4 flex items-center justify-between">
        <div className="flex-1 min-w-0 pr-3">
          <p className="text-xs text-muted-foreground">Today's Site Visit</p>
          <p className="text-lg font-semibold break-words">{data?.team?.replace(' - ', ' ') ?? "—"}</p>
          {data?.members && (
            <div className="flex flex-wrap gap-1 mt-1">
              {data.members.map((member, index) => (
                <span
                  key={index}
                  className="inline-block bg-muted px-1.5 py-0.5 rounded text-xs break-all"
                >
                  {member}
                </span>
              ))}
            </div>
          )}
        </div>
        <button
          className="rounded-md px-3 py-2 bg-primary text-primary-foreground text-sm"
          onClick={onGoToToday}
          aria-label="Go to today's schedule"
        >
          Today
        </button>
      </div>
    </aside>
  )
}
