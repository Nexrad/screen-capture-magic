import { createFileRoute } from "@tanstack/react-router";
import { openTrades, tradeHistory } from "@/lib/mock-data";
import { PageHeader, StatusBadge } from "@/components/status";

export const Route = createFileRoute("/app/trades")({
  head: () => ({
    meta: [
      { title: "Trades — CopyTrade Pro" },
      { name: "description", content: "Your open trades and full trade history from copied signals." },
      { property: "og:title", content: "Trades — CopyTrade Pro" },
      { property: "og:description", content: "Your open trades and full trade history from copied signals." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Trades,
});

function pl(v: string) {
  return v.startsWith("-") ? "text-destructive" : "text-success";
}

function Trades() {
  return (
    <>
      <PageHeader title="Trades" description="Everything copied to your MT5 account." />

      <div className="card-surface overflow-hidden">
        <h2 className="border-b border-border px-5 py-4 text-sm font-semibold text-ink">
          Open trades
        </h2>
        <table className="w-full text-sm">
          <thead className="text-xs text-muted-foreground">
            <tr className="border-b border-border">
              <th className="px-5 py-2.5 text-left font-medium">Symbol</th>
              <th className="px-5 py-2.5 text-left font-medium">Direction</th>
              <th className="px-5 py-2.5 text-left font-medium">Lot</th>
              <th className="px-5 py-2.5 text-right font-medium">P/L</th>
            </tr>
          </thead>
          <tbody>
            {openTrades.map((t) => (
              <tr key={t.id} className="border-b border-border last:border-0">
                <td className="px-5 py-3 font-medium text-ink">{t.symbol}</td>
                <td className="px-5 py-3">{t.direction}</td>
                <td className="px-5 py-3">{t.lot}</td>
                <td className={`px-5 py-3 text-right font-semibold ${pl(t.pl)}`}>{t.pl}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card-surface mt-4 overflow-hidden">
        <h2 className="border-b border-border px-5 py-4 text-sm font-semibold text-ink">
          Trade history
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-sm">
            <thead className="text-xs text-muted-foreground">
              <tr className="border-b border-border">
                <th className="px-5 py-2.5 text-left font-medium">Date</th>
                <th className="px-5 py-2.5 text-left font-medium">Symbol</th>
                <th className="px-5 py-2.5 text-left font-medium">Direction</th>
                <th className="px-5 py-2.5 text-left font-medium">P/L</th>
                <th className="px-5 py-2.5 text-right font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {tradeHistory.map((t) => (
                <tr key={t.id} className="border-b border-border last:border-0">
                  <td className="px-5 py-3 text-muted-foreground">{t.date}</td>
                  <td className="px-5 py-3 font-medium text-ink">{t.symbol}</td>
                  <td className="px-5 py-3">{t.direction}</td>
                  <td className={`px-5 py-3 font-semibold ${pl(t.pl)}`}>{t.pl}</td>
                  <td className="px-5 py-3 text-right">
                    <StatusBadge tone="idle">{t.status}</StatusBadge>
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
