# Device Protection Claims Management Workbench

## Overview

A VS Code-style / IDE-style workbench for the Claims Management unit.  
Three-column layout with persistent tab management in the main canvas.

### Layout Structure

```
┌──────────┬─────────────────────┬────────────────────────────────────────────┐
│ Icon Bar │ Secondary Sidebar   │ Main Canvas (Tabs)                         │
│ (narrow) │ (sections)          │ ┌────────────────────────────────────────┐ │
│          │                     │ │ Tab1 ×  Tab2 ×  Tab3 ×          ▼     │ │
│  Claims  │ • Overview Cards    │ ├────────────────────────────────────────┤ │
│  Activ.  │ • Claims List       │ │                                        │ │
│  Reports │ • Pending           │ │         Active View Content            │ │
│  Docs    │ • Approved          │ │                                        │ │
│  Alerts  │ • Overdue           │ │                                        │ │
│  Settings│ • Rejected          │ │                                        │ │
│          │                     │ └────────────────────────────────────────┘ │
└──────────┴─────────────────────┴────────────────────────────────────────────┘
```

---

## Interaction Flow

1. **Icon Bar (far left, ~60px)**  
   Click an icon → Secondary Sidebar updates with that module’s sections.

2. **Secondary Sidebar (~240px)**  
   Click a section → Opens (or focuses) a tab in the Main Canvas.

3. **Main Canvas**  
   - Each opened section becomes a tab.  
   - Every tab has a close (×) button.  
   - At the far right of the tab bar there is a dropdown (▼).  
   - Dropdown contains:
     - List of all open tabs (click to switch)
     - Close
     - Close Others
     - Close All

---

## Modules & Sections (from CLAIMS MANAGEMENT FEATURES)

### 1. Claims (Icon)
- Overview Cards
- Claims List
- Pending Claims
- Approved Claims
- Overdue Claims
- Rejected Claims

### 2. Activations (Icon)
- Android Activations Report
- Total Samsung Activations
- Total Transsion Activations
- Monthly Activations

### 3. Reports (Icon)
- Total Claims Report
- Daily Claims Report

### 4. Documents (Icon)
- Document Upload / View / Edit
  - Device receipt
  - Protection block-form
  - Police report
  - Court affidavit
  - Photos
  - Proof of payments
- Admin locking features

### 5. Alerts (Icon)
- Duplicate IMEI
- SLA breach
- High-value claims
- Claims process blockage

### 6. Settings (Icon)
- (to be defined)

---

## Top Claims Cards (Overview)

| Card                  | Description              |
|-----------------------|--------------------------|
| Total Claims          | All claims               |
| Pending Claims        | Awaiting action          |
| Approved Claims       | Approved                 |
| Overdue Claims        | Past SLA                 |
| Rejected Claims       | Rejected                 |
| Avg Turnaround Time   | Average processing time  |

---

## Claims List Columns

| Column                        | Notes                                      |
|-------------------------------|--------------------------------------------|
| Claim ID                      | Unique identifier                          |
| Customer Name                 |                                            |
| Phone Number                  |                                            |
| IMEI                          | Primary search field                       |
| Device Model                  |                                            |
| Claim Type                    | S.L.D / S.A.P.                             |
| Date Filed                    |                                            |
| Status                        | Filed, Docs Pending, In Review, Approved, Rejected, Paid, Repaired, Overdue |
| Service Centers               |                                            |
| Repair Costs vs Screen Prices | Comparison field                           |

### Search
- IMEI
- Customer Name
- Phone Number

### Filters
- Date range
- Status
- Claim Type
- Service Center
- Device Model / Brand
- Month

---

## Recommended Implementation Stages

### Stage 1: Shell & Layout
- [ ] Create the three-column layout (Icon Bar + Secondary Sidebar + Main Canvas)
- [ ] Make Icon Bar fixed and narrow
- [ ] Make Secondary Sidebar collapsible
- [ ] Implement basic tab container in the Main Canvas
- [ ] Add dummy icons and dummy sections

### Stage 2: Tab Management
- [ ] Opening a section creates or focuses a tab
- [ ] Each tab has a close button
- [ ] Dropdown at the end of the tab bar
- [ ] Dropdown actions: list tabs, Close, Close Others, Close All
- [ ] Persist open tabs (localStorage or state management)

### Stage 3: Claims Overview
- [ ] Build the Top Claims Cards component
- [ ] Wire to existing endpoints
- [ ] Display real or mock KPI numbers

### Stage 4: Claims List
- [ ] Build data table with all columns listed above
- [ ] Add search (IMEI, Name, Phone)
- [ ] Add filters
- [ ] Pagination
- [ ] Row click → open claim detail tab (optional)

### Stage 5: Activations Reports
- [ ] Android / Samsung / Transsion / Monthly views
- [ ] Charts (optional)

### Stage 6: Documents & Alerts
- [ ] Document upload / view interface
- [ ] Alert list with types (Duplicate IMEI, SLA, High-value, Blockage)

### Stage 7: Polish & Integration
- [ ] Connect all endpoints
- [ ] Loading / empty / error states
- [ ] Responsive behavior
- [ ] Keyboard shortcuts (optional)
- [ ] Theme (light/dark)

---

## Suggested Tech Stack (for Claude Code)

- **React** + TypeScript
- **Tailwind CSS** (or shadcn/ui)
- State: Zustand or React Context for tabs + active module
- Table: TanStack Table
- Charts: Recharts or Chart.js
- Icons: Lucide React

### Core State Shape Example

```ts
type Tab = {
  id: string;
  title: string;
  module: string;
  section: string;
  closable: boolean;
};

type WorkbenchState = {
  activeModule: string | null;
  openTabs: Tab[];
  activeTabId: string | null;
};
```

---

## File Structure Suggestion

```
src/
├── components/
│   ├── layout/
│   │   ├── IconBar.tsx
│   │   ├── SecondarySidebar.tsx
│   │   ├── TabBar.tsx
│   │   └── MainCanvas.tsx
│   ├── claims/
│   │   ├── ClaimsOverview.tsx
│   │   └── ClaimsList.tsx
│   ├── activations/
│   └── documents/
├── store/
│   └── workbenchStore.ts
├── types/
│   └── index.ts
└── App.tsx
```

---

## Next Steps for Claude Code

1. Start with **Stage 1** — get the three-column shell working.
2. Then implement **Stage 2** — full tab behavior (this is the core of the workbench feel).
3. After the shell + tabs are solid, build the individual views one by one.

You can paste sections of this document into Claude Code as context for each stage.
