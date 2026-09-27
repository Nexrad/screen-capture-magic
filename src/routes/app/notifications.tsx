import { createFileRoute } from "@tanstack/react-router";
import { Bell } from "lucide-react";
import { PageHeader } from "@/components/status";

export const Route = createFileRoute("/app/notifications")({
  head: () => ({
    meta: [{ title: "Notifications — CopyTrade Pro" }],
  }),
  component: Notifications,
});

function Notifications() {
  return (
    <>
      <PageHeader title="Notifications" description="Updates about your account and trades." />

      <div className="card-surface flex flex-col items-center gap-3 p-10 text-center">
        <span className="flex size-11 items-center justify-center rounded-full bg-accent text-accent-foreground">
          <Bell className="size-5" />
        </span>
        <h2 className="text-sm font-semibold text-ink">Notifications aren't available yet</h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          CopyTrade Pro doesn't have a notifications feed set up on the backend yet, so there's
          nothing real to show here. Check the Dashboard, Trades and Payment &amp; Access pages
          for your current status in the meantime.
        </p>
      </div>
    </>
  );
}
