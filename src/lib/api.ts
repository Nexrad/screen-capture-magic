// Central client for the existing CopyTrade Pro Python backend.
// In local dev, requests go to "/api/*" on the same origin and Vite proxies them to
// http://127.0.0.1:8000 (see vite.config.ts), so the HttpOnly session cookie works
// without any CORS changes on the backend. Override with VITE_API_BASE_URL if needed.

export const API_BASE_URL: string =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "") || "/api";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function friendly(status: number, backendMsg?: string) {
  if (status === 401) return "Your session has expired. Please log in again.";
  if (status === 403) return "You don't have permission to do that.";
  if (status >= 500) return "Something went wrong on the server. Please try again.";
  return backendMsg || "Request failed. Please try again.";
}

type Opts = { method?: "GET" | "POST"; body?: unknown; redirectOn401?: boolean };

export async function request<T>(path: string, opts: Opts = {}): Promise<T> {
  const { method = "GET", body, redirectOn401 = true } = opts;
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      method,
      credentials: "include",
      headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError("Can't reach the CopyTrade Pro server. Is the backend running?", 0);
  }
  let data: unknown = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }
  if (!res.ok) {
    const msg =
      data && typeof data === "object" && "error" in data && typeof data.error === "string"
        ? data.error
        : undefined;
    if (res.status === 401 && redirectOn401 && typeof window !== "undefined") {
      const here = window.location.pathname + window.location.search;
      if (!window.location.pathname.startsWith("/login")) {
        window.location.assign(`/login?redirect=${encodeURIComponent(here)}`);
      }
    }
    throw new ApiError(friendly(res.status, msg), res.status);
  }
  return data as T;
}

// ---------- Types matching the backend responses ----------

export type Role = "customer" | "admin";
export type Me = { id: string; email: string; role: Role };

export type Access = {
  id: string;
  status: "active" | "expired" | string;
  access_start: string | null;
  access_end: string | null;
  created_at: string;
} | null;

export type Settings = {
  copy_enabled: number;
  provider_enabled: number;
  fixed_lot: number;
  max_open_trades: number;
  max_daily_loss: number | null;
  max_drawdown_percent: number | null;
  updated_at: string;
} | null;

export type Mt5Account = {
  id: string;
  login: string;
  server: string;
  connected: number;
  last_error: string | null;
} | null;

export type CustomerStatus = { access: Access; settings: Settings; mt5_account: Mt5Account };

export type Order = {
  id: string;
  symbol: string;
  direction: string;
  lot: number;
  status: "pending" | "filled" | "rejected" | "error" | string;
  broker_ticket: string | null;
  error_detail: string | null;
  requested_at: string;
  executed_at: string | null;
};

export type Payment = {
  id: string;
  method: string;
  claimed_amount: number | null;
  status: "pending_review" | "approved" | "rejected" | string;
  rejection_reason: string | null;
  submitted_at: string;
  reviewed_at: string | null;
};

export type PendingPayment = Payment & { email: string; user_id: string };

export type AdminCustomer = {
  id: string;
  email: string;
  is_active: number;
  created_at: string;
  access_status: string | null;
  access_end: string | null;
  mt5_connected: number | null;
  copy_enabled: number | null;
};

export type SystemEvent = { component: string; level: string; message: string; created_at: string };

// ---------- Endpoints ----------

export const api = {
  me: () => request<Me>("/auth/me", { redirectOn401: false }),
  login: (email: string, password: string) =>
    request<Me>("/auth/login", { method: "POST", body: { email, password }, redirectOn401: false }),
  register: (email: string, password: string) =>
    request<{ id: string; email: string }>("/auth/register", {
      method: "POST",
      body: { email, password },
      redirectOn401: false,
    }),
  logout: () => request<{ ok: boolean }>("/auth/logout", { method: "POST", redirectOn401: false }),

  status: () => request<CustomerStatus>("/customer/status"),
  copyToggle: (enabled: boolean) =>
    request<{ copy_enabled: boolean }>("/customer/copy-toggle", { method: "POST", body: { enabled } }),
  saveMt5: (login: string, password: string, server: string) =>
    request<{ id: string; login: string; server: string }>("/customer/mt5", {
      method: "POST",
      body: { login, password, server },
    }),
  testMt5: () => request<{ connected: boolean; error: string | null }>("/customer/mt5/test", { method: "POST" }),
  saveSettings: (s: {
    fixed_lot: number;
    max_open_trades: number;
    max_daily_loss: number | null;
    max_drawdown_percent: number | null;
  }) => request<Settings>("/customer/settings", { method: "POST", body: s }),
  orders: () => request<{ orders: Order[] }>("/customer/orders"),
  payments: () => request<{ payments: Payment[] }>("/customer/payments"),
  submitPayment: (b: {
    method: "telebirr" | "cbe";
    claimed_amount: number;
    receipt_filename: string;
    receipt_b64: string;
  }) => request<{ id: string; status: string }>("/customer/payments", { method: "POST", body: b }),

  adminCustomers: () => request<{ customers: AdminCustomer[] }>("/admin/customers"),
  adminSetActive: (id: string, active: boolean) =>
    request<{ ok: boolean }>(`/admin/customers/${encodeURIComponent(id)}/active`, {
      method: "POST",
      body: { active },
    }),
  adminPendingPayments: () => request<{ payments: PendingPayment[] }>("/admin/payments/pending"),
  adminApprove: (id: string) =>
    request<{ status: string }>(`/admin/payments/${encodeURIComponent(id)}/approve`, { method: "POST" }),
  adminReject: (id: string, reason: string) =>
    request<{ status: string }>(`/admin/payments/${encodeURIComponent(id)}/reject`, {
      method: "POST",
      body: { reason },
    }),
  adminOverview: () =>
    request<{ open_trades: number; active_customers: number }>("/admin/trading/overview"),
  adminEmergencyStop: (active: boolean) =>
    request<{ emergency_stop: boolean }>("/admin/emergency-stop", { method: "POST", body: { active } }),
  adminHealth: () =>
    request<{ recent_events: SystemEvent[]; emergency_stop: boolean }>("/admin/system/health"),
};

export function fmtDate(s: string | null | undefined, withTime = false) {
  if (!s) return "—";
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return s;
  return withTime
    ? d.toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
    : d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

export function errMsg(e: unknown) {
  return e instanceof Error ? e.message : "Something went wrong.";
}
