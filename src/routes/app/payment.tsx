import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Upload } from "lucide-react";
import { account } from "@/lib/mock-data";
import { PageHeader, StatRow, StatusBadge } from "@/components/status";

export const Route = createFileRoute("/app/payment")({
  head: () => ({
    meta: [
      { title: "Payment & Access — CopyTrade Pro" },
      { name: "description", content: "Check your challenge access, choose a payment method and upload your receipt." },
      { property: "og:title", content: "Payment & Access — CopyTrade Pro" },
      { property: "og:description", content: "Check your challenge access, choose a payment method and upload your receipt." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Payment,
});

const methods = [
  { id: "telebirr", name: "Telebirr", detail: "Send to 0912 345 678 (CopyTrade Pro)" },
  { id: "cbe", name: "CBE", detail: "Account 1000 1234 5678 — CopyTrade Pro" },
  { id: "bank", name: "Bank Transfer", detail: "Account 0123456789 — CopyTrade Pro PLC" },
];

function Payment() {
  const [method, setMethod] = useState("telebirr");
  const selected = methods.find((m) => m.id === method)!;

  return (
    <>
      <PageHeader title="Payment & access" description="Your challenge access and payment status." />

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card-surface p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-ink">Challenge access</h2>
            <StatusBadge tone="good">{account.access.status}</StatusBadge>
          </div>
          <div className="mt-2 divide-y divide-border">
            <StatRow label="Start" value={account.access.start} />
            <StatRow label="Expires" value={account.access.expires} />
          </div>
        </div>

        <div className="card-surface p-6">
          <h2 className="text-sm font-semibold text-ink">Latest payment</h2>
          <div className="mt-3 rounded-lg bg-warning-soft p-4">
            <StatusBadge tone="warn">Payment pending review</StatusBadge>
            <p className="mt-2 text-sm text-warning-foreground">
              We received your receipt on September 27. An administrator will review it shortly.
            </p>
          </div>
        </div>
      </div>

      <div className="card-surface mt-4 p-6">
        <h2 className="text-sm font-semibold text-ink">Payment method</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {methods.map((m) => (
            <button
              key={m.id}
              onClick={() => setMethod(m.id)}
              className={`rounded-lg border px-4 py-3 text-left text-sm font-medium transition-colors ${
                method === m.id
                  ? "border-primary bg-accent text-accent-foreground"
                  : "border-border bg-surface hover:bg-secondary"
              }`}
            >
              {m.name}
            </button>
          ))}
        </div>
        <div className="mt-4 rounded-lg bg-muted p-4 text-sm text-muted-foreground">
          <p className="font-medium text-ink">Payment instructions</p>
          <p className="mt-1">{selected.detail}</p>
          <p className="mt-1">Amount: $100 — include your email as the payment reference.</p>
        </div>

        <div className="mt-5">
          <p className="text-sm font-medium text-ink">Upload receipt</p>
          <label className="mt-2 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-surface px-4 py-8 text-center hover:bg-secondary">
            <Upload className="size-5 text-muted-foreground" />
            <span className="text-sm font-medium text-ink">Choose a file</span>
            <span className="text-xs text-muted-foreground">JPG, PNG or PDF — max 5 MB</span>
            <input type="file" accept=".jpg,.jpeg,.png,.pdf" className="hidden" />
          </label>
          <button className="mt-4 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 sm:w-auto sm:px-6">
            Submit Receipt
          </button>
        </div>
      </div>
    </>
  );
}
