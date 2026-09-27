import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { admin } from "@/lib/api";
import type { SystemHealth, TradingOverview } from "@/lib/api";
import { PageHeader, StatCard, StatusBadge, LoadingRow, ErrorBanner, EmptyState } from "@/components/status";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({ meta: [{ title: "Admin Dashboard — CopyTrade Pro" }] }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const overviewQuery = useQuery<TradingOverview>({
    queryKey: ["admin", "trading-overview"],
    queryFn: admin.tradingOverview,
  });
  const healthQuery = useQuery<SystemHealth>({
    queryKey: ["admin", "system-health"],
    queryFn: admin.systemHealth,
    refetchInterval: 30_000,
  });
  const queryClient = useQueryClient();
  const emergencyStop = useMutation({
    mutationFn: (active: boolean) => admin.setEmergencyStop(active),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "system-health"] });
    },
  });

  const isActive = healthQuery.data?.emergency_stop ?? false;

  return (
    <>
      <PageHeader title="Admin dashboard" description="Platform-wide trading status and system health." />

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard label="Open trades" value={overviewQuery.data ? String(overviewQuery.data.open_trades) : "—"} />
        <StatCard
          label="Customers copying"
          value={overviewQuery.data ? String(overviewQuery.data.active_customers) : "—"}
        />
      </div>
      {overviewQuery.isError ? (
        <div className="mt-4">
          <ErrorBanner message="Could not load the trading overview." />
        </div>
      ) : null}

      <div className="card-surface mt-4 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-ink">Emergency stop</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Immediately stops new signals from being copied to any customer's MT5 account.
              Existing open positions are not touched.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge tone={isActive ? "bad" : "good"}>{isActive ? "Active" : "Off"}</StatusBadge>
            <button
              onClick={() => emergencyStop.mutate(!isActive)}
              disabled={emergencyStop.isPending || healthQuery.isPending}
              className={
                isActive
                  ? "rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-semibold hover:bg-secondary disabled:opacity-60"
                  : "rounded-lg bg-destructive px-4 py-2.5 text-sm font-semibold text-destructive-foreground hover:opacity-90 disabled:opacity-60"
              }
            >
              {isActive ? "Resume copying" : "Stop all copying"}
            </button>
          </div>
        </div>
        {emergencyStop.isError ? (
          <div className="mt-4">
            <ErrorBanner message="Could not update the emergency stop." />
          </div>
        ) : null}
      </div>

      <div className="card-surface mt-4 p-6">
        <h2 className="text-sm font-semibold text-ink">Recent system events</h2>
        {healthQuery.isPending ? (
          <LoadingRow />
        ) : healthQuery.isError ? (
          <ErrorBanner message="Could not load system events." />
        ) : healthQuery.data && healthQuery.data.recent_events.length > 0 ? (
          <ul className="mt-3 divide-y divide-border">
            {healthQuery.data.recent_events.map((e, i) => (
              <li key={`${e.created_at}-${i}`} className="flex items-center justify-between gap-4 py-2.5">
                <div>
                  <p className="text-sm font-medium text-ink">{e.message}</p>
                  <p className="text-xs text-muted-foreground">
                    {e.component} · {e.created_at}
                  </p>
                </div>
                <StatusBadge tone={e.level === "error" ? "bad" : e.level === "warning" ? "warn" : "idle"}>
                  {e.level}
                </StatusBadge>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState message="No system events yet." />
        )}
      </div>
    </>
  );
}
