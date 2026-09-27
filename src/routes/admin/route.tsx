import { createFileRoute, Outlet } from "@tanstack/react-router";
import { LayoutDashboard, Users, CreditCard, ListOrdered } from "lucide-react";
import { AppShell, type NavItem } from "@/components/app-shell";
import { requireUser } from "@/lib/guard";

const items: NavItem[] = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/customers", label: "Customers", icon: Users },
  { to: "/admin/payments", label: "Payments", icon: CreditCard },
  { to: "/admin/trades", label: "Trades", icon: ListOrdered },
];

export const Route = createFileRoute("/admin")({
  ssr: false,
  beforeLoad: async ({ context, location }) => ({
    user: await requireUser(context.queryClient, location.href, "admin"),
  }),
  pendingComponent: () => <p className="p-10 text-center text-sm text-muted-foreground">Loading...</p>,
  component: () => (
    <AppShell items={items} title="CopyTrade Admin">
      <Outlet />
    </AppShell>
  ),
});
