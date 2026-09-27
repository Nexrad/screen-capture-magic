import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCustomerStatus,
  getPaymentInfo,
  listMyPayments,
  submitPayment,
  fileToBase64,
  ApiError,
} from "@/lib/api";
import type { CustomerStatus, Payment, PaymentInfo } from "@/lib/api";
import { PageHeader, StatRow, StatusBadge, LoadingRow, ErrorBanner, EmptyState } from "@/components/status";

export const Route = createFileRoute("/app/payment")({
  head: () => ({
    meta: [
      { title: "Payment & Access — CopyTrade Pro" },
      { name: "description", content: "Check your challenge access, choose a payment method and upload your receipt." },
    ],
  }),
  component: Payment,
});

function statusTone(status: Payment["status"]) {
  if (status === "approved") return "good" as const;
  if (status === "pending_review") return "warn" as const;
  return "bad" as const; // rejected
}

function Payment() {
  const queryClient = useQueryClient();
  const fileInput = useRef<HTMLInputElement>(null);

  const statusQuery = useQuery<CustomerStatus>({
    queryKey: ["customer", "status"],
    queryFn: getCustomerStatus,
  });
  const infoQuery = useQuery<PaymentInfo>({
    queryKey: ["customer", "payment-info"],
    queryFn: getPaymentInfo,
  });
  const paymentsQuery = useQuery<{ payments: Payment[] }>({
    queryKey: ["customer", "payments"],
    queryFn: listMyPayments,
  });

  const methods = infoQuery.data?.methods ?? [];
  const [method, setMethod] = useState<string>("");
  const activeMethod = method || methods[0] || "";
  const [claimedAmount, setClaimedAmount] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const submit = useMutation({
    mutationFn: async () => {
      if (!file) throw new ApiError("Choose a receipt file first.", 0);
      const receipt_b64 = await fileToBase64(file);
      const amount = claimedAmount.trim() === "" ? undefined : Number(claimedAmount);
      return submitPayment({
        method: activeMethod as "telebirr" | "cbe",
        ...(amount !== undefined ? { claimed_amount: amount } : {}),
        receipt_filename: file.name,
        receipt_b64,
      });
    },
    onSuccess: () => {
      setFile(null);
      setClaimedAmount("");
      if (fileInput.current) fileInput.current.value = "";
      queryClient.invalidateQueries({ queryKey: ["customer", "payments"] });
    },
  });

  const access = statusQuery.data?.access ?? null;
  const latestPayment = paymentsQuery.data?.payments[0] ?? null;
  const instructions = activeMethod
    ? infoQuery.data?.payment_instructions[activeMethod as "telebirr" | "cbe"]
    : undefined;

  return (
    <>
      <PageHeader title="Payment & access" description="Your challenge access and payment status." />

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card-surface p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-ink">Challenge access</h2>
            {statusQuery.isPending ? null : (
              <StatusBadge tone={access?.status === "active" ? "good" : "idle"}>
                {access?.status === "active" ? "Active" : "Not active"}
              </StatusBadge>
            )}
          </div>
          {statusQuery.isPending ? (
            <LoadingRow />
          ) : (
            <div className="mt-2 divide-y divide-border">
              <StatRow label="Start" value={access?.access_start ?? "—"} />
              <StatRow label="Expires" value={access?.access_end ?? "—"} />
            </div>
          )}
        </div>

        <div className="card-surface p-6">
          <h2 className="text-sm font-semibold text-ink">Latest payment</h2>
          {paymentsQuery.isPending ? (
            <LoadingRow />
          ) : latestPayment ? (
            <div className="mt-3 rounded-lg bg-warning-soft p-4">
              <StatusBadge tone={statusTone(latestPayment.status)}>
                {latestPayment.status.replace("_", " ")}
              </StatusBadge>
              <p className="mt-2 text-sm text-warning-foreground">
                Submitted {latestPayment.submitted_at}.
                {latestPayment.status === "rejected" && latestPayment.rejection_reason
                  ? ` Reason: ${latestPayment.rejection_reason}`
                  : ""}
              </p>
            </div>
          ) : (
            <div className="mt-3">
              <EmptyState message="You haven't submitted a payment yet." />
            </div>
          )}
        </div>
      </div>

      <div className="card-surface mt-4 p-6">
        <h2 className="text-sm font-semibold text-ink">Payment method</h2>
        {infoQuery.isPending ? (
          <LoadingRow />
        ) : infoQuery.isError ? (
          <ErrorBanner message="Could not load payment instructions." />
        ) : (
          <>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {methods.map((m) => (
                <button
                  key={m}
                  onClick={() => setMethod(m)}
                  className={`rounded-lg border px-4 py-3 text-left text-sm font-medium capitalize transition-colors ${
                    activeMethod === m
                      ? "border-primary bg-accent text-accent-foreground"
                      : "border-border bg-surface hover:bg-secondary"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
            <div className="mt-4 rounded-lg bg-muted p-4 text-sm text-muted-foreground">
              <p className="font-medium text-ink">Payment instructions</p>
              <p className="mt-1">{instructions ?? "Select a payment method above."}</p>
              <p className="mt-1">Amount: {infoQuery.data?.challenge_price} — include your email as the payment reference.</p>
            </div>
          </>
        )}

        <div className="mt-5">
          <p className="text-sm font-medium text-ink">Claimed amount (optional)</p>
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="e.g. 100"
            className="mt-1.5 w-full max-w-xs rounded-lg border border-input bg-surface px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
            value={claimedAmount}
            onChange={(e) => setClaimedAmount(e.target.value)}
          />
        </div>

        <div className="mt-5">
          <p className="text-sm font-medium text-ink">Upload receipt</p>
          <label className="mt-2 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-surface px-4 py-8 text-center hover:bg-secondary">
            <Upload className="size-5 text-muted-foreground" />
            <span className="text-sm font-medium text-ink">{file ? file.name : "Choose a file"}</span>
            <span className="text-xs text-muted-foreground">JPG, PNG or PDF</span>
            <input
              ref={fileInput}
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </label>

          {submit.isError ? (
            <div className="mt-3">
              <ErrorBanner
                message={submit.error instanceof ApiError ? submit.error.message : "Could not submit your receipt."}
              />
            </div>
          ) : null}
          {submit.isSuccess ? (
            <div className="mt-3">
              <StatusBadge tone="good">Receipt submitted for review</StatusBadge>
            </div>
          ) : null}

          <button
            onClick={() => submit.mutate()}
            disabled={submit.isPending || !file || !activeMethod}
            className="mt-4 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60 sm:w-auto sm:px-6"
          >
            {submit.isPending ? "Submitting…" : "Submit Receipt"}
          </button>
        </div>
      </div>
    </>
  );
}
