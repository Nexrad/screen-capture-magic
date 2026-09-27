import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PageHeader, StatCard, StatRow, StatusBadge } from "@/components/status";
import { Loading, ErrorBox } from "@/components/states";
import { api, errMsg, fmtDate } from "@/lib/api";
import { qk, useOrders, useStatus } from "@/lib/queries";
import { orderLabel, orderTone, PROVIDER_NAME } from "@/lib/labels";

export const Route = createFileRoute("/app/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — CopyTrade Pro" },
      { name: "description", content: "See your copy trading status, MT5 connection and today's results at a glance." },
      { property: "og:title", content: "Dashboard — CopyTrade Pro" },
      { property: "og:description", content: "See your copy trading status, MT5 connection and today's results at a glance." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { user } = Route.useRouteContext();
  const status = useStatus();
  const orders = useOrders();
  const qc = useQueryClient();
  const toggle = useMutation({
    mutationFn: (enabled: boolean) => api.copyToggle(enabled),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.status }),
  });

  if (status.isPending) return <Loading label="Loading dashboard..." />;
  if (status.isError)
    return <ErrorBox message={`Unable to load dashboard. ${errMsg(status.error)}`} onRetry={() => status.refetch()} />;

  const { settings, mt5_account: mt5, access } = status.data;
  const copying = !!settings?.copy_enabled;
  const providerOn = !!settings?.provider_enabled;
  const accessActive = access?.status === "active";
  const openCount = orders.data?.filter((o) => o.status === "filled").length;

  return (
    <>
      <PageHeader title="Welcome back" description={`Signed in as ${user.email}`} />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card-surface flex items-center justify-between gap-4 p-6 lg:col-span-2">
          <div>
            <p className="text-sm text-muted-foreground">Copy trading</p>
            <p className="mt-1 flex items-center gap-2 text-3xl font-bold text-ink">
              <span
                className={`size-3 rounded-full ${copying ? "bg-success" : "bg-muted-foreground"}`}
              />
              {copying ? "ON" : "OFF"}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {copying
                ? "New signals from Ab Marshall are being copied to your MT5 account."
                : "Copying is paused. New signals will not be sent to your account."}
            </p>
            {toggle.isError ? (
              <p className="mt-2 text-sm text-destructive">Couldn't change copying. {errMsg(toggle.error)}</p>
            ) : null}
          </div>
          <button
            disabled={toggle.isPending}
            onClick={() => toggle.mutate(!copying)}
            className={
              (copying
                ? "rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-semibold hover:bg-secondary"
                : "rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90") +
              " disabled:opacity-60"
            }
          >
            {toggle.isPending ? "Saving..." : copying ? "Turn Off" : "Turn On"}
          </button>
        </div>

        <div className="card-surface p-6">
          <h2 className="text-sm font-semibold text-ink">Connection</h2>
          <div className="mt-2 divide-y divide-border">
            <StatRow
              label="MT5"
              value={!mt5 ? "Not set up" : mt5.connected ? "Connected" : "Disconnected"}
              tone={!mt5 ? "idle" : mt5.connected ? "good" : "bad"}
            />
            <StatRow label="Provider" value={providerOn ? PROVIDER_NAME : `${PROVIDER_NAME} (off)`} tone={providerOn ? "good" : "idle"} />
            <StatRow label="Access" value={accessActive ? "Active" : "Not active"} tone={accessActive ? "good" : "warn"} />
          </div>
          {mt5 && !mt5.connected && mt5.last_error ? (
            <p className="mt-2 text-xs text-destructive">{mt5.last_error}</p>
          ) : null}
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Balance" value="—" hint="Not available yet" />
        <StatCard label="Equity" value="—" hint="Not available yet" />
        <StatCard label="Today's P/L" value="—" hint="Not available yet" />
        <StatCard label="Open trades" value={openCount === undefined ? "—" : String(openCount)} />
      </div>

      <div className="card-surface mt-4 p-6">
        <h2 className="text-sm font-semibold text-ink">Recent trades</h2>
        {orders.isPending ? (
          <Loading />
        ) : orders.isError ? (
          <p className="mt-3 text-sm text-destructive">Unable to load trades. {errMsg(orders.error)}</p>
        ) : orders.data.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">No trades copied yet.</p>
        ) : (
          <ul className="mt-3 divide-y divide-border">
            {orders.data.slice(0, 5).map((t) => (
              <li key={t.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-ink">
                    {t.symbol} {t.direction.toUpperCase()}
                  </p>
                  <p className="text-xs text-muted-foreground">{fmtDate(t.requested_at, true)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">{t.lot} lot</span>
                  <StatusBadge tone={orderTone(t.status)}>{orderLabel(t.status)}</StatusBadge>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
