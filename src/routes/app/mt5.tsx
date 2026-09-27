import { createFileRoute } from "@tanstack/react-router";
import { account } from "@/lib/mock-data";
import { PageHeader, StatRow, StatusBadge } from "@/components/status";

export const Route = createFileRoute("/app/mt5")({
  head: () => ({
    meta: [
      { title: "MT5 — CopyTrade Pro" },
      { name: "description", content: "Check your MT5 connection and update your account credentials." },
      { property: "og:title", content: "MT5 — CopyTrade Pro" },
      { property: "og:description", content: "Check your MT5 connection and update your account credentials." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Mt5,
});

const field =
  "mt-1.5 w-full rounded-lg border border-input bg-surface px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20";

function Mt5() {
  return (
    <>
      <PageHeader title="MT5" description="Your MetaTrader 5 connection." />

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card-surface p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-ink">MT5 status</h2>
            <StatusBadge tone="good">{account.mt5.status}</StatusBadge>
          </div>
          <div className="mt-2 divide-y divide-border">
            <StatRow label="Account" value={account.mt5.account} />
            <StatRow label="Broker" value={account.mt5.broker} />
            <StatRow label="Balance" value={account.balance} />
            <StatRow label="Equity" value={account.equity} />
          </div>
          <button className="mt-5 w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-semibold hover:bg-secondary">
            Test Connection
          </button>
        </div>

        <div className="card-surface p-6">
          <h2 className="text-sm font-semibold text-ink">Connection details</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Your saved password is never displayed. Leave it blank to keep the current one.
          </p>
          <div className="mt-4 space-y-4">
            <div>
              <label className="text-sm font-medium" htmlFor="login">Account number</label>
              <input id="login" className={field} defaultValue={account.mt5.account} />
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="password">Password</label>
              <input id="password" type="password" className={field} placeholder="••••••••" />
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="server">Broker server</label>
              <input id="server" className={field} defaultValue="ExampleBroker-Live" />
            </div>
            <button className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90">
              Save Connection
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
