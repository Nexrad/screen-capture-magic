import { createFileRoute } from "@tanstack/react-router";
import { adminSummary, adminActivity } from "@/lib/mock-data";
import { PageHeader, StatCard, StatRow } from "@/components/status";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — CopyTrade Pro" },
      {
        name: "description",
        content: "Overview of customers, payments, connections and provider status.",
      },
      { property: "og:title", content: "Admin Dashboard — CopyTrade Pro" },
      {
        property: "og:description",
        content: "Overview of customers, payments, connections and provider status.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdminDashboard,
});

function AdminDashboard() {
  return (
    <>
      <PageHeader title="Overview" description="Everything you need to run the service." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {adminSummary.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} />
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <div className="card-surface p-6">
          <h2 className="text-sm font-semibold text-ink">Provider</h2>
          <div className="mt-2 divide-y divide-border">
            <StatRow label="Ab Marshall" value="Connected" tone="good" />
            <StatRow label="Last signal" value="2 minutes ago" />
          </div>
        </div>

        <div className="card-surface p-6 lg:col-span-2">
          <h2 className="text-sm font-semibold text-ink">Recent activity</h2>
          <ul className="mt-2 divide-y divide-border">
            {adminActivity.map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-3 py-2.5">
                <span className="text-sm text-ink">{a.text}</span>
                <span className="text-xs whitespace-nowrap text-muted-foreground">{a.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
