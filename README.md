# Rotation Calendar (5-Team Daily Rotation)

Mobile-first Next.js app with built-in API route handlers (no separate backend). It assigns one of 5 teams per weekday and rotates weekly so each weekday gets each team exactly once in a 5-week cycle.

Features
- Month calendar with team short names
- Sticky “Today’s team” card
- Prev/Next navigation + Today
- Previous 5 and Next 5 months as horizontal chips
- CSV export endpoint
- Configurable cycle start date (default 2025-09-29, Monday)
- Jest unit tests for rotation + integration test for /api/calendar
- Example NestJS CalendarService (reference)

Getting Started
- Install: npm install
- Dev: npm run dev (Next.js App Router; no separate server required)
- Tests: npm test
- Seed (prints JSON to stdout): npm run seed

API
- GET /api/teams
- GET /api/today
- GET /api/calendar?year=YYYY&month=MM[&startDate=YYYY-MM-DD]
- GET /api/calendar/csv?year=YYYY&month=MM
- GET /api/months?year=YYYY&month=MM

Config
- config/rotation.ts -> defaultCycleStartDate. You can also pass startDate in /api/calendar query and wire a settings UI later.

Deployment
- Vercel recommended. Connect repo and deploy. Route handlers run serverlessly with no extra setup.
- For a separate NestJS backend, see examples/nest/calendar.service.ts and mirror the endpoints.

Notes
- The rotation logic uses UTC-normalized dates to avoid DST/timezone drift.
- UI uses shadcn defaults; big tap targets and accessible labels are included.
