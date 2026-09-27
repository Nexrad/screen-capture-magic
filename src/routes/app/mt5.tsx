import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCustomerStatus, saveMt5Account, testMt5Connection, ApiError } from "@/lib/api";
import type { CustomerStatus } from "@/lib/api";
import { PageHeader, StatRow, StatusBadge, LoadingRow, ErrorBanner } from "@/components/status";

export const Route = createFileRoute("/app/mt5")({
  head: () => ({
    meta: [
      { title: "MT5 — CopyTrade Pro" },
      { name: "description", content: "Check your MT5 connection and update your account credentials." },
    ],
  }),
  component: Mt5,
});

const field =
  "mt-1.5 w-full rounded-lg border border-input bg-surface px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20";

function Mt5() {
  const queryClient = useQueryClient();
  const statusQuery = useQuery<CustomerStatus>({
    queryKey: ["customer", "status"],
    queryFn: getCustomerStatus,
  });
  const mt5 = statusQuery.data?.mt5_account ?? null;

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [server, setServer] = useState("");
  const [testResult, setTestResult] = useState<{ connected: boolean; error: string | null } | null>(null);

  const save = useMutation({
    mutationFn: () => saveMt5Account(login, password, server),
    onSuccess: () => {
      setPassword("");
      setTestResult(null);
      queryClient.invalidateQueries({ queryKey: ["customer", "status"] });
    },
  });

  const test = useMutation({
    mutationFn: testMt5Connection,
    onSuccess: (result) => {
      setTestResult(result);
      queryClient.invalidateQueries({ queryKey: ["customer", "status"] });
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    save.mutate();
  };

  return (
    <>
      <PageHeader title="MT5" description="Your MetaTrader 5 connection." />

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card-surface p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-ink">MT5 status</h2>
            {statusQuery.isPending ? null : (
              <StatusBadge tone={mt5?.connected ? "good" : mt5 ? "warn" : "idle"}>
                {mt5 ? (mt5.connected ? "Connected" : "Not connected") : "Not set up"}
              </StatusBadge>
            )}
          </div>
          {statusQuery.isPending ? (
            <LoadingRow />
          ) : mt5 ? (
            <div className="mt-2 divide-y divide-border">
              <StatRow label="Account" value={mt5.login} />
              <StatRow label="Server" value={mt5.server} />
              {mt5.last_error ? <StatRow label="Last error" value={mt5.last_error} tone="bad" /> : null}
            </div>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">
              No MT5 account connected yet. Add your details on the right to get started.
            </p>
          )}

          {mt5 ? (
            <button
              onClick={() => test.mutate()}
              disabled={test.isPending}
              className="mt-5 w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-semibold hover:bg-secondary disabled:opacity-60"
            >
              {test.isPending ? "Testing…" : "Test Connection"}
            </button>
          ) : null}

          {testResult ? (
            <div className="mt-3">
              {testResult.connected ? (
                <StatusBadge tone="good">Connection successful</StatusBadge>
              ) : (
                <ErrorBanner message={testResult.error ?? "Could not connect. Check your credentials and server."} />
              )}
            </div>
          ) : null}
          {test.isError ? (
            <div className="mt-3">
              <ErrorBanner
                message={test.error instanceof ApiError ? test.error.message : "Could not test the connection."}
              />
            </div>
          ) : null}
        </div>

        <div className="card-surface p-6">
          <h2 className="text-sm font-semibold text-ink">Connection details</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            For security, your password is never shown again after saving - re-enter it any time
            you want to update your connection.
          </p>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label className="text-sm font-medium" htmlFor="login">
                Account number
              </label>
              <input
                id="login"
                required
                className={field}
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                placeholder={mt5?.login ?? undefined}
              />
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                className={field}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="server">
                Broker server
              </label>
              <input
                id="server"
                required
                className={field}
                value={server}
                onChange={(e) => setServer(e.target.value)}
                placeholder={mt5?.server ?? undefined}
              />
            </div>

            {save.isError ? (
              <ErrorBanner
                message={save.error instanceof ApiError ? save.error.message : "Could not save your MT5 details."}
              />
            ) : null}
            {save.isSuccess ? <StatusBadge tone="good">Saved</StatusBadge> : null}

            <button
              type="submit"
              disabled={save.isPending}
              className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
            >
              {save.isPending ? "Saving…" : "Save Connection"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
