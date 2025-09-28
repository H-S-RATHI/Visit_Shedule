"use client"

import type { MonthMeta } from "@/lib/types"
import { cn } from "@/lib/utils"

interface Props {
  label: string
  months: MonthMeta[]
  onSelect: (m: MonthMeta) => void
  current: { year: number; month: number }
}

export function MonthChips({ label, months, onSelect, current }: Props) {
  return (
    <section aria-label={label} className="mt-2">
      <h3 className="text-sm text-muted-foreground mb-2">{label}</h3>
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2" role="list">
        {months.map((m) => {
          const isActive = m.year === current.year && m.month === current.month
          return (
            <button
              key={`${m.year}-${m.month}`}
              onClick={() => onSelect(m)}
              className={cn(
                "rounded-full px-3 py-2 text-sm border",
                "aria-[current=true]:bg-primary aria-[current=true]:text-primary-foreground",
                "bg-background text-foreground",
              )}
              aria-current={isActive ? "true" : "false"}
            >
              {m.label}
            </button>
          )
        })}
      </div>
    </section>
  )
}
