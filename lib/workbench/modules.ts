import {
  Activity,
  Ban,
  Bell,
  CalendarDays,
  ChartColumn,
  CircleCheck,
  CircleX,
  ClipboardList,
  Clock,
  Copy,
  FileText,
  Gem,
  Image,
  LayoutDashboard,
  List,
  Lock,
  Receipt,
  Scale,
  Settings,
  Shield,
  Smartphone,
  Timer,
  Wallet,
} from "lucide-react";
import type { ModuleId, Section, Tab, WorkbenchModule } from "@/types/workbench";

/**
 * Single source of truth for the icon bar and the secondary sidebar.
 * Adding a section here makes it appear in the sidebar; give it a `view`
 * that exists in components/views/registry.tsx.
 */
export const MODULES: WorkbenchModule[] = [
  {
    id: "claims",
    label: "Claims",
    icon: ClipboardList,
    groups: [
      {
        sections: [
          { id: "overview", label: "Overview Cards", icon: LayoutDashboard, view: "claims.overview" },
          { id: "list", label: "Claims List", icon: List, view: "claims.list" },
        ],
      },
      {
        label: "By status",
        sections: [
          { id: "pending", label: "Pending Claims", icon: Clock, view: "claims.list", params: { status: "pending" } },
          { id: "approved", label: "Approved Claims", icon: CircleCheck, view: "claims.list", params: { status: "approved" } },
          { id: "overdue", label: "Overdue Claims", icon: Timer, view: "claims.list", params: { status: "overdue" } },
          { id: "rejected", label: "Rejected Claims", icon: CircleX, view: "claims.list", params: { status: "rejected" } },
        ],
      },
    ],
  },
  {
    id: "activations",
    label: "Activations",
    icon: Smartphone,
    groups: [
      {
        sections: [
          { id: "android", label: "Android Activations Report", icon: Activity, view: "activations.android" },
          { id: "samsung", label: "Total Samsung Activations", icon: Smartphone, view: "activations.samsung" },
          { id: "transsion", label: "Total Transsion Activations", icon: Smartphone, view: "activations.transsion" },
          { id: "monthly", label: "Monthly Activations", icon: CalendarDays, view: "activations.monthly" },
        ],
      },
    ],
  },
  {
    id: "reports",
    label: "Reports",
    icon: ChartColumn,
    groups: [
      {
        sections: [
          { id: "total", label: "Total Claims Report", icon: ChartColumn, view: "reports.total" },
          { id: "daily", label: "Daily Claims Report", icon: CalendarDays, view: "reports.daily" },
        ],
      },
    ],
  },
  {
    id: "documents",
    label: "Documents",
    icon: FileText,
    groups: [
      {
        label: "Document types",
        sections: [
          { id: "receipt", label: "Device Receipt", icon: Receipt, view: "documents.type", params: { type: "receipt" } },
          { id: "block-form", label: "Protection Block-Form", icon: Shield, view: "documents.type", params: { type: "block-form" } },
          { id: "police-report", label: "Police Report", icon: FileText, view: "documents.type", params: { type: "police-report" } },
          { id: "affidavit", label: "Court Affidavit", icon: Scale, view: "documents.type", params: { type: "affidavit" } },
          { id: "photos", label: "Photos", icon: Image, view: "documents.type", params: { type: "photos" } },
          { id: "payments", label: "Proof of Payments", icon: Wallet, view: "documents.type", params: { type: "payments" } },
        ],
      },
      {
        label: "Admin",
        sections: [{ id: "locking", label: "Admin Locking", icon: Lock, view: "documents.locking" }],
      },
    ],
  },
  {
    id: "alerts",
    label: "Alerts",
    icon: Bell,
    groups: [
      {
        sections: [
          { id: "duplicate-imei", label: "Duplicate IMEI", icon: Copy, view: "alerts.list", params: { type: "duplicate-imei" } },
          { id: "sla-breach", label: "SLA Breach", icon: Timer, view: "alerts.list", params: { type: "sla-breach" } },
          { id: "high-value", label: "High-Value Claims", icon: Gem, view: "alerts.list", params: { type: "high-value" } },
          { id: "blockage", label: "Claims Process Blockage", icon: Ban, view: "alerts.list", params: { type: "blockage" } },
        ],
      },
    ],
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    groups: [
      {
        sections: [{ id: "general", label: "General", icon: Settings, view: "settings.general" }],
      },
    ],
  },
];

export const MODULE_BY_ID = Object.fromEntries(MODULES.map((m) => [m.id, m])) as Record<
  ModuleId,
  WorkbenchModule
>;

export function sectionTabId(module: ModuleId, section: string) {
  return `${module}:${section}`;
}

export function tabForSection(module: ModuleId, section: Section): Tab {
  return {
    id: sectionTabId(module, section.id),
    title: section.label,
    module,
    section: section.id,
    view: section.view,
    params: section.params,
    closable: true,
  };
}

export function findSection(module: ModuleId, sectionId: string): Section | undefined {
  return MODULE_BY_ID[module]?.groups.flatMap((g) => g.sections).find((s) => s.id === sectionId);
}

/** Icon for a tab: its section's icon, falling back to the module's. */
export function tabIcon(tab: Tab) {
  return findSection(tab.module, tab.section)?.icon ?? MODULE_BY_ID[tab.module]?.icon ?? FileText;
}

export const DEFAULT_MODULE: ModuleId = "claims";

export const DEFAULT_TABS: Tab[] = [
  tabForSection("claims", findSection("claims", "overview")!),
];
