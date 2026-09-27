import { createFileRoute } from "@tanstack/react-router";
import { adminCustomers } from "@/lib/mock-data";
import { PageHeader, StatusBadge } from "@/components/status";

export const Route = createFileRoute("/admin/customers")({
  head: () => ({
    meta: [
      { title: "Customers — CopyTrade Pro Admin" },
      {
        name: "description",
        content: "All customers with their access, MT5 connection, copying state and results.",
      },
      { property: "og:title", content: "Customers — CopyTrade Pro Admin" },
      {
        property: "og:description",
        content: "All customers with their access, MT5 connection, copying state and results.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdminCustomers,
});

function pl(v: string) {
  return v.startsWith("-") ? "text-destructive" : "text-success";
}

function AdminCustomers() {
  return (
    <>
      <PageHeader title="Customers" description={`${adminCustomers.length} customers shown.`} />

      <div className="card-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-sm">
            <thead className="text-xs text-muted-foreground">
              <tr className="border-b border-border">
                <th className="px-5 py-2.5 text-left font-medium">Customer</th>
                <th className="px-5 py-2.5 text-left font-medium">Access</th>
                <th className="px-5 py-2.5 text-left font-medium">MT5</th>
                <th className="px-5 py-2.5 text-left font-medium">Copying</th>
                <th className="px-5 py-2.5 text-left font-medium">P/L</th>
                <th className="px-5 py-2.5 text-right font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {adminCustomers.map((c) => (
                <tr key={c.id} className="border-b border-border last:border-0">
                  <td className="px-5 py-3 font-medium text-ink">{c.name}</td>
                  <td className="px-5 py-3">{c.access}</td>
                  <td className="px-5 py-3">{c.mt5}</td>
                  <td className="px-5 py-3">{c.copying ? "On" : "Off"}</td>
                  <td className={`px-5 py-3 font-semibold ${pl(c.pl)}`}>{c.pl}</td>
                  <td className="px-5 py-3 text-right">
                    <StatusBadge tone={c.status}>
                      {c.status === "good" ? "Healthy" : c.status === "warn" ? "Pending" : "Issue"}
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
