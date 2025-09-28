export interface Team {
  id: number
  name: string // "Devesh - Satyam"
  members: string[] // ["Devesh","Satyam"]
  shortName: string // "Devesh-Satyam"
}

export interface CalendarDay {
  date: string // YYYY-MM-DD
  team: string // team name (e.g., "Devesh - Satyam")
  teamId: number
  members: string[]
}

export interface CalendarResponse {
  year: number
  month: number // 1-12
  days: CalendarDay[]
}

export interface MonthMeta {
  year: number
  month: number // 1-12
  label: string // "Oct 2025"
}

export interface MonthsResponse {
  current: { year: number; month: number }
  previous: MonthMeta[]
  next: MonthMeta[]
}
