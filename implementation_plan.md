# Dashboard Command Center Architecture Upgrade

This plan details the implementation of the Executive Command Center, focusing on an interactive layout header, a live-connected Headaches Widget, and an aggregate dashboard page.

## User Review Required

> [!WARNING]
> The database schema for the `headaches` table is inferred from the prompt. It will assume:
> - `id` (uuid)
> - `date_reported` (date/timestamp)
> - `reported_by_name` (text)
> - `description` (text)
> - `status` (text) - Assumed to be "Unresolved" / "Resolved"
> - `urgency` (text) - e.g., "High", "Medium", "Low"
> - `department` (text)
> 
> Let me know if any of these columns differ in your live Supabase!

## Proposed Changes

### Component Layer
#### [MODIFY] [Header.tsx](file:///c:/Users/Admin/Desktop/eag-os/src/components/layout/Header.tsx)
- Convert to a client component (`"use client"`).
- Implement `useState` to manage three separate popovers:
  1. **Notifications Bell**: Toggles a list of recent placeholder alerts.
  2. **Settings**: Toggles a clean "Preferences" menu.
  3. **Profile**: Toggles a session menu to switch between "Dr. Jack (Clinic Lead)" and "Denis Thuo (Admin)".
- We will build the popovers inline using Tailwind absolute positioning (`absolute top-full mt-2 right-0 bg-white shadow-md...`) to keep it clean and self-contained without needing third-party libraries.

#### [MODIFY] [HeadachesWidget.tsx](file:///c:/Users/Admin/Desktop/eag-os/src/components/dashboard/HeadachesWidget.tsx)
- Convert to a client component (`"use client"`).
- Add a fetching hook (`useEffect`) to pull live records from the `headaches` table, sorted by highest urgency.
- Build a compact inline form (Description, Urgency dropdown, Department dropdown) to insert new blockers via `supabase.from('headaches').insert(...)`.
- State will be updated automatically upon successful submission to refresh the view instantly.

---

### Page Layer
#### [MODIFY] [page.tsx (Dashboard Root)](file:///c:/Users/Admin/Desktop/eag-os/src/app/dashboard/page.tsx)
- **Data Fetching (Server-Side)**:
  - Fetch `expenses` and `departmental_supplies` to calculate `Net Profit = 2,500,000 - Total Expenses`.
  - Fetch an exact count from the `staff` table.
  - Fetch a count from the `headaches` table (filtering for unresolved status).
- **Layout**:
  - **Top Row**: 3 Live Metric Summary Cards (Net Profit, Active Personnel, Unresolved Blockers) using `@/components/ui/Card`.
  - **Bottom Split Grid**: Two columns rendering `<HeadachesWidget />` and `<PartnershipsCard />`.

## Verification Plan

### Automated Tests
- Run `npx tsc --noEmit` to ensure there are zero TypeScript compilation errors.
- Run the build process (`npm run build`) to ensure server/client boundaries are respected.

### Manual Verification
- Navigate to `/dashboard`.
- Test the Header popovers (Notifications, Settings, Profile).
- Test adding a new headache through the HeadachesWidget form and verify it appears.
- Verify the live metric cards display the correct aggregated totals.

### Post-Task Execution
- Auto-stage changes (`git add .`)
- Commit with: `feat: implement interactive header suite and live dashboard command center`
- Push to GitHub.
