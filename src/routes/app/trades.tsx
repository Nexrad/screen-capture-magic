import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { listMyOrders } from "@/lib/api";
import type { Order } from "@/lib/api";
import { PageHeader, StatusBadge, LoadingRow, ErrorBanner, EmptyState } from "@/components/status";

export const Route = createFileRoute("/app/trades")({
  head: () => ({
    meta: [
      { title: "Trades — CopyTrade Pro" },
      { name: "description", content: "Your open trades and full trade history from copied signals." },
    ],
  }),
  component: Trades,
});

function statusTone(status: Order["status"]) {
  if (status === "filled") return "good" as const;
  if (status === "pending") return "warn" as const;
  return "bad" as const; // rejected | error
}

function Trades() {
  const ordersQuery = useQuery<{ orders: Order[] }>({
    queryKey: ["customer", "orders"],
    queryFn: listMyOrders,
  });

  const orders = ordersQuery.data?.orders ?? [];
  const open = orders.filter((o) => o.status === "pending" || o.status === "filled");
  const history = orders.filter((o) => o.status === "rejected" || o.status === "error");

  return (
    <>
      <PageHeader title="Trades" description="Everything copied to your MT5 account." />

      {ordersQuery.isPending ? (
        <div className="card-surface p-5">
          <LoadingRow />
        </div>
      ) : ordersQuery.isError ? (
        <div className="card-surface p-5">
          <ErrorBanner message="Could not load your trades." />
        </div>
      ) : orders.length === 0 ? (
        <div className="card-surface p-5">
          <EmptyState message="No trades yet. Once signals start copying, they'll show up here." />
        </div>
      ) : (
        <>
          <div className="card-surface overflow-hidden">
            <h2 className="border-b border-border px-5 py-4 text-sm font-semibold text-ink">Open orders</h2>
            {open.length === 0 ? (
              <div className="p-5">
                <EmptyState message="No open orders right now." />
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="text-xs text-muted-foreground">
                  <tr className="border-b border-border">
                    <th className="px-5 py-2.5 text-left font-medium">Symbol</th>
                    <th className="px-5 py-2.5 text-left font-medium">Direction</th>
                    <th className="px-5 py-2.5 text-left font-medium">Lot</th>
                    <th className="px-5 py-2.5 text-right font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {open.map((o) => (
                    <tr key={o.id} className="border-b border-border last:border-0">
                      <td className="px-5 py-3 font-medium text-ink">{o.symbol}</td>
                      <td className="px-5 py-3">{o.direction}</td>
                      <td className="px-5 py-3">{o.lot}</td>
                      <td className="px-5 py-3 text-right">
                        <StatusBadge tone={statusTone(o.status)}>{o.status}</StatusBadge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="card-surface mt-4 overflow-hidden">
            <h2 className="border-b border-border px-5 py-4 text-sm font-semibold text-ink">Trade history</h2>
            {history.length === 0 ? (
              <div className="p-5">
                <EmptyState message="No closed trades yet." />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px] text-sm">
                  <thead className="text-xs text-muted-foreground">
                    <tr className="border-b border-border">
                      <th className="px-5 py-2.5 text-left font-medium">Requested</th>
                      <th className="px-5 py-2.5 text-left font-medium">Symbol</th>
                      <th className="px-5 py-2.5 text-left font-medium">Direction</th>
                      <th className="px-5 py-2.5 text-right font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((o) => (
                      <tr key={o.id} className="border-b border-border last:border-0">
                        <td className="px-5 py-3 text-muted-foreground">{o.requested_at}</td>
                        <td className="px-5 py-3 font-medium text-ink">{o.symbol}</td>
                        <td className="px-5 py-3">{o.direction}</td>
                        <td className="px-5 py-3 text-right">
                          <StatusBadge tone={statusTone(o.status)}>{o.status}</StatusBadge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
