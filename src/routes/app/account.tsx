import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { useCurrentUser } from "@/lib/auth";
import { changePassword, ApiError } from "@/lib/api";
import { PageHeader, StatRow, LoadingRow, ErrorBanner, StatusBadge } from "@/components/status";

export const Route = createFileRoute("/app/account")({
  head: () => ({
    meta: [{ title: "Account — CopyTrade Pro" }],
  }),
  component: Account,
});

const field =
  "mt-1.5 w-full rounded-lg border border-input bg-surface px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20";

function Account() {
  const { data: user, isPending } = useCurrentUser();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const updatePassword = useMutation({
    mutationFn: () => changePassword(currentPassword, newPassword),
    onSuccess: () => {
      setCurrentPassword("");
      setNewPassword("");
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    updatePassword.mutate();
  };

  return (
    <>
      <PageHeader title="Account" description="Your CopyTrade Pro login." />

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card-surface p-6">
          <h2 className="text-sm font-semibold text-ink">Account details</h2>
          {isPending ? (
            <LoadingRow />
          ) : user ? (
            <div className="mt-2 divide-y divide-border">
              <StatRow label="Email" value={user.email} />
              <StatRow label="Role" value={user.role === "admin" ? "Administrator" : "Customer"} />
              <StatRow label="Account ID" value={user.id} />
            </div>
          ) : null}
        </div>

        <div className="card-surface p-6">
          <h2 className="text-sm font-semibold text-ink">Change password</h2>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label className="text-sm font-medium" htmlFor="current_password">
                Current password
              </label>
              <input
                id="current_password"
                type="password"
                required
                autoComplete="current-password"
                className={field}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="new_password">
                New password
              </label>
              <input
                id="new_password"
                type="password"
                required
                minLength={10}
                autoComplete="new-password"
                className={field}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <p className="mt-1.5 text-xs text-muted-foreground">At least 10 characters.</p>
            </div>

            {updatePassword.isError ? (
              <ErrorBanner
                message={
                  updatePassword.error instanceof ApiError
                    ? updatePassword.error.message
                    : "Could not update your password."
                }
              />
            ) : null}
            {updatePassword.isSuccess ? <StatusBadge tone="good">Password updated</StatusBadge> : null}

            <button
              type="submit"
              disabled={updatePassword.isPending}
              className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
            >
              {updatePassword.isPending ? "Updating…" : "Update password"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
