import { createFileRoute } from "@tanstack/react-router";
import { notifications } from "@/lib/mock-data";
import { PageHeader, StatusBadge } from "@/components/status";

export const Route = createFileRoute("/app/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — CopyTrade Pro" },
      {
        name: "description",
        content: "Updates about copied trades, your MT5 connection and your access.",
      },
      { property: "og:title", content: "Notifications — CopyTrade Pro" },
      {
        property: "og:description",
        content: "Updates about copied trades, your MT5 connection and your access.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Notifications,
});

function Notifications() {
  return (
    <>
      <PageHeader title="Notifications" description="Recent updates about your account." />

      <div className="card-surface overflow-hidden">
        <ul className="divide-y divide-border">
          {notifications.map((n) => (
            <li key={n.id} className="flex flex-wrap items-start justify-between gap-3 px-5 py-4">
              <div>
                <p className="text-sm font-medium text-ink">{n.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{n.body}</p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge tone={n.tone}>{n.tone === "warn" ? "Attention" : "Info"}</StatusBadge>
                <span className="text-xs text-muted-foreground">{n.time}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
