import { createFileRoute } from "@tanstack/react-router";
import { adminPayments } from "@/lib/mock-data";
import { PageHeader, StatusBadge } from "@/components/status";
import type { Status } from "@/lib/mock-data";

export const Route = createFileRoute("/admin/payments")({
  head: () => ({
    meta: [
      { title: "Payments — CopyTrade Pro Admin" },
      {
        name: "description",
        content: "Review submitted payments and approve or reject customer access.",
      },
      { property: "og:title", content: "Payments — CopyTrade Pro Admin" },
      {
        property: "og:description",
        content: "Review submitted payments and approve or reject customer access.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdminPayments,
});

function tone(status: string): Status {
  if (status === "Approved") return "good";
  if (status === "Rejected") return "bad";
  return "warn";
}

function AdminPayments() {
  const pending = adminPayments.filter((p) => p.status === "Pending").length;

  return (
    <>
      <PageHeader title="Payments" description={`${pending} payments waiting for review.`} />

      <div className="card-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-sm">
            <thead className="text-xs text-muted-foreground">
              <tr className="border-b border-border">
                <th className="px-5 py-2.5 text-left font-medium">Customer</th>
                <th className="px-5 py-2.5 text-left font-medium">Method</th>
                <th className="px-5 py-2.5 text-left font-medium">Amount</th>
                <th className="px-5 py-2.5 text-left font-medium">Submitted</th>
                <th className="px-5 py-2.5 text-left font-medium">Status</th>
                <th className="px-5 py-2.5 text-right font-medium">Receipt</th>
              </tr>
            </thead>
            <tbody>
              {adminPayments.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0">
                  <td className="px-5 py-3 font-medium text-ink">{p.customer}</td>
                  <td className="px-5 py-3">{p.method}</td>
                  <td className="px-5 py-3">{p.amount}</td>
                  <td className="px-5 py-3 text-muted-foreground">{p.submitted}</td>
                  <td className="px-5 py-3">
                    <StatusBadge tone={tone(p.status)}>{p.status}</StatusBadge>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold hover:bg-secondary">
                      View receipt
                    </button>
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
