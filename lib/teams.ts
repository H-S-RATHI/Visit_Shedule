// This matches the spec and example ("Uday - Amit" etc.)
import type { Team } from "./types"

export const TEAMS: Team[] = [
  {
    id: 0,
    name: "Devesh - Satyam",
    members: ["Devesh", "Satyam"],
    shortName: "Devesh-Satyam",
  },
  {
    id: 1,
    name: "Uday - Amit",
    members: ["Uday", "Amit"],
    shortName: "Uday-Amit",
  },
  {
    id: 2,
    name: "Nihal - Karan",
    members: ["Nihal", "Karan"],
    shortName: "Nihal-Karan",
  },
  {
    id: 3,
    name: "Revu - Gravit",
    members: ["Revu", "Gravit"],
    shortName: "Revu-Gravit",
  },
  {
    id: 4,
    name: "Dinesh - Daksh",
    members: ["Dinesh", "Daksh"],
    shortName: "Dinesh-Daksh",
  },
]

// Special team for weekends (Saturday & Sunday)
export const HOLIDAY_TEAM: Team = {
  id: -1,
  name: "No Visit",
  members: ["Weekend Holiday"],
  shortName: "Holiday",
}
