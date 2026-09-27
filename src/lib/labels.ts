import type { Status } from "./mock-data";

export function orderTone(status: string): Status {
  if (status === "filled") return "good";
  if (status === "pending") return "warn";
  if (status === "rejected" || status === "error") return "bad";
  return "idle";
}

export function orderLabel(status: string) {
  return (
    { filled: "Filled", pending: "Pending", rejected: "Rejected", error: "Error" }[status] ?? status
  );
}

export function paymentTone(status: string): Status {
  if (status === "approved") return "good";
  if (status === "rejected") return "bad";
  return "warn";
}

export function paymentLabel(status: string) {
  return (
    { pending_review: "Pending review", approved: "Approved", rejected: "Rejected" }[status] ?? status
  );
}

export function methodLabel(m: string) {
  return ({ telebirr: "Telebirr", cbe: "CBE" } as Record<string, string>)[m] ?? m;
}

export const PROVIDER_NAME = "Ab Marshall";
