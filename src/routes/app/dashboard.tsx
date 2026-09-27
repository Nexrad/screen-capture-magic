import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { account, openTrades, tradeHistory } from "@/lib/mock-data";
import { PageHeader, StatCard, StatRow, StatusBadge } from "@/components/status";

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
  const [copying, setCopying] = useState(account.copying);

  return (
    <>
      <PageHeader title="Welcome back" description={`Signed in as ${account.name}`} />

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
          </div>
          <button
            onClick={() => setCopying((v) => !v)}
            className={
              copying
                ? "rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-semibold hover:bg-secondary"
                : "rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
            }
          >
            {copying ? "Turn Off" : "Turn On"}
          </button>
        </div>

        <div className="card-surface p-6">
          <h2 className="text-sm font-semibold text-ink">Connection</h2>
          <div className="mt-2 divide-y divide-border">
            <StatRow label="MT5" value="Connected" tone="good" />
            <StatRow label="Provider" value={account.provider} tone="good" />
            <StatRow label="Access" value="Active" tone="good" />
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Balance" value={account.balance} />
        <StatCard label="Equity" value={account.equity} />
        <StatCard label="Today's P/L" value={account.todayPl} hint="Since 00:00" />
        <StatCard label="Open trades" value={String(account.openTrades)} />
      </div>

      <div className="card-surface mt-4 p-6">
        <h2 className="text-sm font-semibold text-ink">Recent trades</h2>
        <ul className="mt-3 divide-y divide-border">
          {[...openTrades, ...tradeHistory].slice(0, 5).map((t) => {
            const isOpen = "lot" in t && !("status" in t);
            return (
              <li key={t.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-ink">
                    {t.symbol} {t.direction}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {"date" in t ? t.date : "Just now"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-sm font-semibold ${t.pl.startsWith("-") ? "text-destructive" : "text-success"}`}
                  >
                    {t.pl}
                  </span>
                  <StatusBadge tone={isOpen ? "warn" : "good"}>
                    {"status" in t ? t.status : "Open"}
                  </StatusBadge>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
