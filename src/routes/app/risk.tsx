import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { account } from "@/lib/mock-data";
import { PageHeader } from "@/components/status";

export const Route = createFileRoute("/app/risk")({
  head: () => ({
    meta: [
      { title: "Risk Settings — CopyTrade Pro" },
      { name: "description", content: "Set your lot size, trade limits and daily loss limits for copied trades." },
      { property: "og:title", content: "Risk Settings — CopyTrade Pro" },
      { property: "og:description", content: "Set your lot size, trade limits and daily loss limits for copied trades." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Risk,
});

const field =
  "mt-1.5 w-full rounded-lg border border-input bg-surface px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20";

const settings = [
  { id: "lot", label: "Fixed lot", value: "0.01", hint: "The lot size used for every copied trade." },
  { id: "max", label: "Maximum open trades", value: "3", hint: "No new trades are copied above this number." },
  { id: "loss", label: "Maximum daily loss", value: "$50", hint: "Copying pauses for the day when this loss is reached." },
  { id: "dd", label: "Maximum drawdown", value: "10%", hint: "Copying stops if your account falls this far from its peak." },
];

function Risk() {
  const [providerOn, setProviderOn] = useState(true);

  return (
    <>
      <PageHeader title="Risk settings" description="Control how much risk each copied trade takes." />

      <div className="card-surface max-w-2xl p-6">
        <div className="space-y-5">
          {settings.map((s) => (
            <div key={s.id}>
              <label className="text-sm font-medium" htmlFor={s.id}>{s.label}</label>
              <input id={s.id} className={field} defaultValue={s.value} />
              <p className="mt-1.5 text-xs text-muted-foreground">{s.hint}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
          <div>
            <p className="text-sm font-medium text-ink">Provider</p>
            <p className="text-xs text-muted-foreground">{account.provider}</p>
          </div>
          <button
            onClick={() => setProviderOn((v) => !v)}
            aria-pressed={providerOn}
            className={`relative h-6 w-11 rounded-full transition-colors ${providerOn ? "bg-primary" : "bg-muted"}`}
          >
            <span
              className={`absolute top-0.5 size-5 rounded-full bg-card transition-all ${providerOn ? "left-5.5" : "left-0.5"}`}
            />
          </button>
        </div>

        <button className="mt-6 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90">
          Save Settings
        </button>
      </div>
    </>
  );
}
