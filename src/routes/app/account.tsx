import { createFileRoute } from "@tanstack/react-router";
import { account } from "@/lib/mock-data";
import { PageHeader, StatRow } from "@/components/status";

export const Route = createFileRoute("/app/account")({
  head: () => ({
    meta: [
      { title: "Account — CopyTrade Pro" },
      {
        name: "description",
        content: "Your CopyTrade Pro profile details, password and account actions.",
      },
      { property: "og:title", content: "Account — CopyTrade Pro" },
      {
        property: "og:description",
        content: "Your CopyTrade Pro profile details, password and account actions.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Account,
});

function Account() {
  return (
    <>
      <PageHeader title="Account" description="Your profile and sign-in details." />

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card-surface p-6">
          <h2 className="text-sm font-semibold text-ink">Profile</h2>
          <div className="mt-2 divide-y divide-border">
            <StatRow label="Name" value={account.name} />
            <StatRow label="Email" value={account.email} />
            <StatRow label="Provider" value={account.provider} />
          </div>
        </div>

        <div className="card-surface p-6">
          <h2 className="text-sm font-semibold text-ink">Access</h2>
          <div className="mt-2 divide-y divide-border">
            <StatRow label="Status" value={account.access.status} tone="good" />
            <StatRow label="Started" value={account.access.start} />
            <StatRow label="Expires" value={account.access.expires} />
          </div>
        </div>
      </div>

      <div className="card-surface mt-4 p-6">
        <h2 className="text-sm font-semibold text-ink">Password</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Change the password you use to sign in.
        </p>
        <div className="mt-4 grid gap-3 sm:max-w-sm">
          <input
            type="password"
            placeholder="Current password"
            className="rounded-lg border border-border bg-surface px-3 py-2.5 text-sm"
          />
          <input
            type="password"
            placeholder="New password"
            className="rounded-lg border border-border bg-surface px-3 py-2.5 text-sm"
          />
          <button className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90">
            Update password
          </button>
        </div>
      </div>
    </>
  );
}
