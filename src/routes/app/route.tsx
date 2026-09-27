import { createFileRoute, Outlet } from "@tanstack/react-router";
import {
  LayoutDashboard,
  ListOrdered,
  Plug,
  SlidersHorizontal,
  CreditCard,
  Bell,
  User,
} from "lucide-react";
import { AppShell, type NavItem } from "@/components/app-shell";

const items: NavItem[] = [
  { to: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/app/trades", label: "Trades", icon: ListOrdered },
  { to: "/app/mt5", label: "MT5", icon: Plug },
  { to: "/app/risk", label: "Risk Settings", icon: SlidersHorizontal },
  { to: "/app/payment", label: "Payment & Access", icon: CreditCard },
  { to: "/app/notifications", label: "Notifications", icon: Bell },
  { to: "/app/account", label: "Account", icon: User },
];

export const Route = createFileRoute("/app")({
  component: () => (
    <AppShell items={items} title="CopyTrade Pro">
      <Outlet />
    </AppShell>
  ),
});
