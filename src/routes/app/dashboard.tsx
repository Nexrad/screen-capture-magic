import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getCustomerStatus, setCopyEnabled, listMyOrders } from "@/lib/api";
import type { CustomerStatus, Order } from "@/lib/api";
import { useCurrentUser } from "@/lib/auth";
import {
  PageHeader,
  StatCard,
  StatRow,
  StatusBadge,
  LoadingRow,
  ErrorBanner,
  EmptyState,
} from "@/components/status";

export const Route = createFileRoute("/app/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — CopyTrade Pro" },
      {
        name: "description",
        content: "See your copy trading status, MT5 connection and recent orders at a glance.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { data: user } = useCurrentUser();
  const queryClient = useQueryClient();

  const statusQuery = useQuery<CustomerStatus>({
    queryKey: ["customer", "status"],
    queryFn: getCustomerStatus,
  });
  const ordersQuery = useQuery<{ orders: Order[] }>({
    queryKey: ["customer", "orders"],
    queryFn: listMyOrders,
  });

  const toggleCopy = useMutation({
    mutationFn: (enabled: boolean) => setCopyEnabled(enabled),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer", "status"] });
    },
  });

  const settings = statusQuery.data?.settings ?? null;
  const mt5 = statusQuery.data?.mt5_account ?? null;
  const access = statusQuery.data?.access ?? null;
  const copying = !!settings?.copy_enabled;
  const recentOrders = ordersQuery.data?.orders.slice(0, 5) ?? [];

  return (
    <>
      <PageHeader title="Welcome back" {...(user ? { description: `Signed in as ${user.email}` } : {})} />

      {statusQuery.isError ? (
        <div className="mb-4">
          <ErrorBanner message="Could not load your account status. Try refreshing the page." />
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card-surface flex items-center justify-between gap-4 p-6 lg:col-span-2">
          <div>
            <p className="text-sm text-muted-foreground">Copy trading</p>
            {statusQuery.isPending ? (
              <LoadingRow />
            ) : (
              <>
                <p className="mt-1 flex items-center gap-2 text-3xl font-bold text-ink">
                  <span className={`size-3 rounded-full ${copying ? "bg-success" : "bg-muted-foreground"}`} />
                  {copying ? "ON" : "OFF"}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {copying
                    ? "New signals from your provider are being copied to your MT5 account."
                    : "Copying is paused. New signals will not be sent to your account."}
                </p>
              </>
            )}
          </div>
          <button
            onClick={() => toggleCopy.mutate(!copying)}
            disabled={statusQuery.isPending || toggleCopy.isPending}
            className={
              copying
                ? "rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-semibold hover:bg-secondary disabled:opacity-60"
                : "rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
            }
          >
            {toggleCopy.isPending ? "Saving…" : copying ? "Turn Off" : "Turn On"}
          </button>
        </div>

        <div className="card-surface p-6">
          <h2 className="text-sm font-semibold text-ink">Connection</h2>
          {statusQuery.isPending ? (
            <LoadingRow />
          ) : (
            <div className="mt-2 divide-y divide-border">
              <StatRow
                label="MT5"
                value={mt5 ? (mt5.connected ? "Connected" : "Not connected") : "Not set up"}
                tone={mt5?.connected ? "good" : mt5 ? "warn" : "idle"}
              />
              <StatRow
                label="Provider"
                value={settings ? (settings.provider_enabled ? "Enabled" : "Disabled") : "—"}
                tone={settings?.provider_enabled ? "good" : "idle"}
              />
              <StatRow
                label="Access"
                value={access?.status === "active" ? "Active" : "Not active"}
                tone={access?.status === "active" ? "good" : "warn"}
              />
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <StatCard label="Fixed lot" value={settings ? String(settings.fixed_lot) : "—"} />
        <StatCard label="Max open trades" value={settings ? String(settings.max_open_trades) : "—"} />
        <StatCard
          label="Max daily loss"
          value={settings?.max_daily_loss != null ? String(settings.max_daily_loss) : "No limit"}
        />
      </div>

      <div className="card-surface mt-4 p-6">
        <h2 className="text-sm font-semibold text-ink">Recent orders</h2>
        {ordersQuery.isPending ? (
          <LoadingRow />
        ) : ordersQuery.isError ? (
          <ErrorBanner message="Could not load your recent orders." />
        ) : recentOrders.length > 0 ? (
          <ul className="mt-3 divide-y divide-border">
            {recentOrders.map((o) => (
              <li key={o.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-ink">
                    {o.symbol} {o.direction}
                  </p>
                  <p className="text-xs text-muted-foreground">{o.requested_at}</p>
                </div>
                <StatusBadge
                  tone={o.status === "filled" ? "good" : o.status === "pending" ? "warn" : "bad"}
                >
                  {o.status}
                </StatusBadge>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState message="No orders yet. Once signals start copying, they'll show up here." />
        )}
      </div>
    </>
  );
}
