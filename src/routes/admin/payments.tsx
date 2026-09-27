import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { admin } from "@/lib/api";
import type { AdminPayment } from "@/lib/api";
import { PageHeader, StatusBadge, LoadingRow, ErrorBanner, EmptyState } from "@/components/status";

export const Route = createFileRoute("/admin/payments")({
  head: () => ({ meta: [{ title: "Payments — CopyTrade Pro Admin" }] }),
  component: AdminPayments,
});

function AdminPayments() {
  const queryClient = useQueryClient();
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [reason, setReason] = useState("");

  const paymentsQuery = useQuery<{ payments: AdminPayment[] }>({
    queryKey: ["admin", "pending-payments"],
    queryFn: admin.listPendingPayments,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin", "pending-payments"] });

  const approve = useMutation({
    mutationFn: (id: string) => admin.approvePayment(id),
    onSuccess: invalidate,
  });
  const reject = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => admin.rejectPayment(id, reason),
    onSuccess: () => {
      setRejectingId(null);
      setReason("");
      invalidate();
    },
  });

  return (
    <>
      <PageHeader title="Payments" description="Receipts awaiting review." />

      <div className="card-surface overflow-hidden">
        {paymentsQuery.isPending ? (
          <div className="px-5">
            <LoadingRow />
          </div>
        ) : paymentsQuery.isError ? (
          <div className="p-5">
            <ErrorBanner message="Could not load pending payments." />
          </div>
        ) : paymentsQuery.data && paymentsQuery.data.payments.length > 0 ? (
          <ul className="divide-y divide-border">
            {paymentsQuery.data.payments.map((p) => (
              <li key={p.id} className="p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-ink">{p.email}</p>
                    <p className="text-xs text-muted-foreground">
                      {p.method.toUpperCase()} · {p.claimed_amount ? `$${p.claimed_amount}` : "amount not given"} ·
                      submitted {p.submitted_at}
                    </p>
                  </div>
                  <StatusBadge tone="warn">Pending review</StatusBadge>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => approve.mutate(p.id)}
                    disabled={approve.isPending}
                    className="rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
                  >
                    Approve
                  </button>
                  {rejectingId === p.id ? (
                    <>
                      <input
                        autoFocus
                        placeholder="Reason for rejection"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="rounded-lg border border-input bg-surface px-3 py-2 text-xs outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
                      />
                      <button
                        onClick={() => reject.mutate({ id: p.id, reason })}
                        disabled={reject.isPending || !reason.trim()}
                        className="rounded-lg bg-destructive px-3.5 py-2 text-xs font-semibold text-destructive-foreground hover:opacity-90 disabled:opacity-60"
                      >
                        Confirm reject
                      </button>
                      <button
                        onClick={() => {
                          setRejectingId(null);
                          setReason("");
                        }}
                        className="rounded-lg border border-border bg-surface px-3.5 py-2 text-xs font-semibold hover:bg-secondary"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setRejectingId(p.id)}
                      className="rounded-lg border border-border bg-surface px-3.5 py-2 text-xs font-semibold hover:bg-secondary"
                    >
                      Reject
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-5">
            <EmptyState message="No payments are waiting for review." />
          </div>
        )}
      </div>
      {(approve.isError || reject.isError) && (
        <div className="mt-4">
          <ErrorBanner message="That action failed. Please try again." />
        </div>
      )}
    </>
  );
}
