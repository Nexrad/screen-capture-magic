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
import { RequireAuth } from "@/components/require-auth";

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
  // The whole /app tree depends on the browser's session_token cookie, which
  // the Node SSR process never has - rendering it server-side would either
  // require forwarding cookies to a manual backend call during SSR or would
  // always render as "logged out". Client-only avoids both problems and
  // costs nothing here since this area isn't meant to be indexed anyway.
  ssr: false,
  component: () => (
    <RequireAuth>
      <AppShell items={items} title="CopyTrade Pro">
        <Outlet />
      </AppShell>
    </RequireAuth>
  ),
});
