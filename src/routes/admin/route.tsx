import { createFileRoute, Outlet } from "@tanstack/react-router";
import { LayoutDashboard, Users, CreditCard } from "lucide-react";
import { AppShell, type NavItem } from "@/components/app-shell";
import { RequireAuth } from "@/components/require-auth";

const items: NavItem[] = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/customers", label: "Customers", icon: Users },
  { to: "/admin/payments", label: "Payments", icon: CreditCard },
];

export const Route = createFileRoute("/admin")({
  // See src/routes/app/route.tsx for why this whole tree is client-only.
  ssr: false,
  component: () => (
    <RequireAuth role="admin">
      <AppShell items={items} title="CopyTrade Pro Admin">
        <Outlet />
      </AppShell>
    </RequireAuth>
  ),
});
