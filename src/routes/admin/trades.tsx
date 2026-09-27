import { createFileRoute } from "@tanstack/react-router";
import { adminTrades } from "@/lib/mock-data";
import { PageHeader, StatusBadge } from "@/components/status";

export const Route = createFileRoute("/admin/trades")({
  head: () => ({
    meta: [
      { title: "Trades — CopyTrade Pro Admin" },
      {
        name: "description",
        content: "Copied trades across all customer accounts, with results and status.",
      },
      { property: "og:title", content: "Trades — CopyTrade Pro Admin" },
      {
        property: "og:description",
        content: "Copied trades across all customer accounts, with results and status.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdminTrades,
});

function pl(v: string) {
  return v.startsWith("-") ? "text-destructive" : "text-success";
}

function AdminTrades() {
  return (
    <>
      <PageHeader title="Trades" description="Signals copied to customer accounts." />

      <div className="card-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-sm">
            <thead className="text-xs text-muted-foreground">
              <tr className="border-b border-border">
                <th className="px-5 py-2.5 text-left font-medium">Customer</th>
                <th className="px-5 py-2.5 text-left font-medium">Symbol</th>
                <th className="px-5 py-2.5 text-left font-medium">Direction</th>
                <th className="px-5 py-2.5 text-left font-medium">Lot</th>
                <th className="px-5 py-2.5 text-left font-medium">P/L</th>
                <th className="px-5 py-2.5 text-right font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {adminTrades.map((t) => (
                <tr key={t.id} className="border-b border-border last:border-0">
                  <td className="px-5 py-3 font-medium text-ink">{t.customer}</td>
                  <td className="px-5 py-3">{t.symbol}</td>
                  <td className="px-5 py-3">{t.direction}</td>
                  <td className="px-5 py-3">{t.lot}</td>
                  <td className={`px-5 py-3 font-semibold ${pl(t.pl)}`}>{t.pl}</td>
                  <td className="px-5 py-3 text-right">
                    <StatusBadge tone={t.status === "Open" ? "good" : "idle"}>
                      {t.status}
                    </StatusBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
