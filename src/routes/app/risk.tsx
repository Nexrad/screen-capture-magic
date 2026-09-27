import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCustomerStatus, updateRiskSettings, setProviderEnabled, ApiError } from "@/lib/api";
import type { CustomerStatus } from "@/lib/api";
import { PageHeader, LoadingRow, ErrorBanner, StatusBadge } from "@/components/status";

export const Route = createFileRoute("/app/risk")({
  head: () => ({
    meta: [
      { title: "Risk Settings — CopyTrade Pro" },
      { name: "description", content: "Set your lot size, trade limits and daily loss limits for copied trades." },
    ],
  }),
  component: Risk,
});

const field =
  "mt-1.5 w-full rounded-lg border border-input bg-surface px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20";

function Risk() {
  const queryClient = useQueryClient();
  const statusQuery = useQuery<CustomerStatus>({
    queryKey: ["customer", "status"],
    queryFn: getCustomerStatus,
  });
  const settings = statusQuery.data?.settings ?? null;

  const [fixedLot, setFixedLot] = useState("");
  const [maxOpenTrades, setMaxOpenTrades] = useState("");
  const [maxDailyLoss, setMaxDailyLoss] = useState("");
  const [maxDrawdown, setMaxDrawdown] = useState("");

  // Seed the form once the real settings arrive - never with invented defaults.
  useEffect(() => {
    if (!settings) return;
    setFixedLot(String(settings.fixed_lot));
    setMaxOpenTrades(String(settings.max_open_trades));
    setMaxDailyLoss(settings.max_daily_loss != null ? String(settings.max_daily_loss) : "");
    setMaxDrawdown(settings.max_drawdown_percent != null ? String(settings.max_drawdown_percent) : "");
  }, [settings]);

  const save = useMutation({
    mutationFn: () =>
      updateRiskSettings({
        fixed_lot: Number(fixedLot),
        max_open_trades: Number(maxOpenTrades),
        max_daily_loss: maxDailyLoss.trim() === "" ? null : Number(maxDailyLoss),
        max_drawdown_percent: maxDrawdown.trim() === "" ? null : Number(maxDrawdown),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer", "status"] });
    },
  });

  const toggleProvider = useMutation({
    mutationFn: (enabled: boolean) => setProviderEnabled(enabled),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer", "status"] });
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    save.mutate();
  };

  const providerOn = !!settings?.provider_enabled;

  return (
    <>
      <PageHeader title="Risk settings" description="Control how much risk each copied trade takes." />

      <div className="card-surface max-w-2xl p-6">
        {statusQuery.isPending ? (
          <LoadingRow />
        ) : statusQuery.isError ? (
          <ErrorBanner message="Could not load your settings." />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-medium" htmlFor="fixed_lot">
                Fixed lot
              </label>
              <input
                id="fixed_lot"
                type="number"
                step="0.01"
                min="0"
                required
                className={field}
                value={fixedLot}
                onChange={(e) => setFixedLot(e.target.value)}
              />
              <p className="mt-1.5 text-xs text-muted-foreground">The lot size used for every copied trade.</p>
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="max_open_trades">
                Maximum open trades
              </label>
              <input
                id="max_open_trades"
                type="number"
                step="1"
                min="1"
                required
                className={field}
                value={maxOpenTrades}
                onChange={(e) => setMaxOpenTrades(e.target.value)}
              />
              <p className="mt-1.5 text-xs text-muted-foreground">No new trades are copied above this number.</p>
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="max_daily_loss">
                Maximum daily loss
              </label>
              <input
                id="max_daily_loss"
                type="number"
                step="0.01"
                min="0"
                placeholder="No limit"
                className={field}
                value={maxDailyLoss}
                onChange={(e) => setMaxDailyLoss(e.target.value)}
              />
              <p className="mt-1.5 text-xs text-muted-foreground">
                Copying pauses for the day when this loss is reached. Leave blank for no limit.
              </p>
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="max_drawdown">
                Maximum drawdown (%)
              </label>
              <input
                id="max_drawdown"
                type="number"
                step="0.1"
                min="0"
                placeholder="No limit"
                className={field}
                value={maxDrawdown}
                onChange={(e) => setMaxDrawdown(e.target.value)}
              />
              <p className="mt-1.5 text-xs text-muted-foreground">
                Copying stops if your account falls this far from its peak. Leave blank for no limit.
              </p>
            </div>

            <div className="flex items-center justify-between border-t border-border pt-5">
              <div>
                <p className="text-sm font-medium text-ink">Provider</p>
                <p className="text-xs text-muted-foreground">Ab Marshall signals</p>
              </div>
              <button
                type="button"
                onClick={() => toggleProvider.mutate(!providerOn)}
                disabled={toggleProvider.isPending}
                aria-pressed={providerOn}
                className={`relative h-6 w-11 rounded-full transition-colors disabled:opacity-60 ${providerOn ? "bg-primary" : "bg-muted"}`}
              >
                <span
                  className={`absolute top-0.5 size-5 rounded-full bg-card transition-all ${providerOn ? "left-5.5" : "left-0.5"}`}
                />
              </button>
            </div>

            {save.isError ? (
              <ErrorBanner
                message={save.error instanceof ApiError ? save.error.message : "Could not save your settings."}
              />
            ) : null}
            {save.isSuccess ? <StatusBadge tone="good">Saved</StatusBadge> : null}

            <button
              type="submit"
              disabled={save.isPending}
              className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
            >
              {save.isPending ? "Saving…" : "Save Settings"}
            </button>
          </form>
        )}
      </div>
    </>
  );
}
