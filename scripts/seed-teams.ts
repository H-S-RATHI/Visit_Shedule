// Usage: npx tsx scripts/seed-teams.ts
import { TEAMS } from "@/lib/teams"

async function main() {
  // In a real environment, write to data/teams.json (FS not available in preview)
  const payload = JSON.stringify(TEAMS, null, 2)
  // eslint-disable-next-line no-console
  console.log(payload)
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e)
  process.exit(1)
})
