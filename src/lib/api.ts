// src/lib/api.ts
//
// Centralized client for the CopyTrade Pro Python backend.
//
// The backend is a separate process (default http://127.0.0.1:8000) from
// this frontend's dev server (default http://localhost:8080), so every
// call here goes straight to the backend origin over fetch() with
// `credentials: "include"` - that's what makes the browser attach the
// HttpOnly `session_token` cookie the backend sets on login/register.
// See app/http_app.py on the backend for the matching CORS/cookie setup.
//
// Override the backend origin at build/dev time with VITE_API_BASE_URL if
// you're not running the default `python main.py` on 127.0.0.1:8000.
export const API_BASE: string =
  (import.meta as unknown as { env?: Record<string, string | undefined> }).env?.[
    "VITE_API_BASE_URL"
  ] ?? "http://127.0.0.1:8000";

export type Role = "customer" | "admin";

export type User = {
  id: string;
  email: string;
  role: Role;
};

export type Access = {
  id: string;
  user_id: string;
  status: "active" | "expired";
  access_start: string | null;
  access_end: string | null;
  activated_by: string | null;
  payment_id: string | null;
  created_at: string;
};

export type CustomerSettings = {
  user_id: string;
  copy_enabled: number;
  provider_enabled: number;
  fixed_lot: number;
  max_open_trades: number;
  max_daily_loss: number | null;
  max_drawdown_percent: number | null;
  updated_at: string;
};

export type Mt5Account = {
  id: string;
  login: string;
  server: string;
  connected: number;
  last_error: string | null;
};

export type CustomerStatus = {
  access: Access | null;
  settings: CustomerSettings | null;
  mt5_account: Mt5Account | null;
};

export type Payment = {
  id: string;
  method: "telebirr" | "cbe";
  claimed_amount: number | null;
  status: "pending_review" | "approved" | "rejected";
  rejection_reason: string | null;
  submitted_at: string;
  reviewed_at: string | null;
};

export type Order = {
  id: string;
  user_id: string;
  signal_id: string;
  symbol: string;
  direction: string;
  lot: number;
  status: "pending" | "filled" | "rejected" | "error";
  broker_ticket: string | null;
  error_detail: string | null;
  requested_at: string;
  executed_at: string | null;
};

export type AdminCustomer = {
  id: string;
  email: string;
  is_active: number;
  created_at: string;
  access_status: "active" | null;
  access_end: string | null;
  mt5_connected: number | null;
  copy_enabled: number | null;
};

export type AdminPayment = Payment & {
  user_id: string;
  email: string;
  receipt_path: string;
};

export type TradingOverview = {
  open_trades: number;
  active_customers: number;
};

export type SystemEvent = {
  component: string;
  level: string;
  message: string;
  created_at: string;
};

export type SystemHealth = {
  recent_events: SystemEvent[];
  emergency_stop: boolean;
};

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers ?? {}),
      },
    });
  } catch {
    throw new ApiError(
      `Could not reach the CopyTrade Pro server at ${API_BASE}. Is the backend running?`,
      0,
    );
  }

  const data = await response.json().catch(() => ({}) as Record<string, unknown>);

  if (!response.ok) {
    const message =
      typeof (data as { error?: unknown }).error === "string"
        ? (data as { error: string }).error
        : `Request failed (${response.status})`;
    throw new ApiError(message, response.status);
  }

  return data as T;
}

// ---------------- Auth ----------------

export function register(email: string, password: string) {
  return request<{ id: string; email: string }>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function login(email: string, password: string) {
  return request<User>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function getCurrentUser() {
  return request<User>("/auth/me");
}

/** Like getCurrentUser, but resolves to null instead of throwing when logged out. */
export async function getCurrentUserOrNull(): Promise<User | null> {
  try {
    return await getCurrentUser();
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) return null;
    throw err;
  }
}

export function logout() {
  return request<{ ok: true }>("/auth/logout", { method: "POST" });
}

export function changePassword(currentPassword: string, newPassword: string) {
  return request<{ ok: true }>("/auth/change-password", {
    method: "POST",
    body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
  });
}

// ---------------- Customer ----------------

export function getCustomerStatus() {
  return request<CustomerStatus>("/customer/status");
}

export function saveMt5Account(login: string, password: string, server: string) {
  return request<{ id: string; login: string; server: string }>("/customer/mt5", {
    method: "POST",
    body: JSON.stringify({ login, password, server }),
  });
}

export function testMt5Connection() {
  return request<{ connected: boolean; error: string | null }>("/customer/mt5/test", {
    method: "POST",
  });
}

export function updateRiskSettings(input: {
  fixed_lot?: number;
  max_open_trades?: number;
  max_daily_loss?: number | null;
  max_drawdown_percent?: number | null;
}) {
  return request<CustomerSettings>("/customer/settings", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function setCopyEnabled(enabled: boolean) {
  return request<{ copy_enabled: boolean }>("/customer/copy-toggle", {
    method: "POST",
    body: JSON.stringify({ enabled }),
  });
}

export function setProviderEnabled(enabled: boolean) {
  return request<{ provider_enabled: boolean }>("/customer/provider-toggle", {
    method: "POST",
    body: JSON.stringify({ enabled }),
  });
}

export function submitPayment(input: {
  method: "telebirr" | "cbe";
  claimed_amount?: number;
  receipt_filename: string;
  receipt_b64: string;
}) {
  return request<{ id: string; status: string }>("/customer/payments", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export type PaymentInfo = {
  challenge_price: string;
  payment_instructions: Record<"telebirr" | "cbe", string>;
  methods: string[];
};

export function getPaymentInfo() {
  return request<PaymentInfo>("/customer/payment-info");
}

export function listMyPayments() {
  return request<{ payments: Payment[] }>("/customer/payments");
}

export function listMyOrders() {
  return request<{ orders: Order[] }>("/customer/orders");
}

/** Reads a File from an <input type="file"> into a base64 string for submitPayment(). */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // strip the "data:<mime>;base64," prefix - the backend wants raw base64
      resolve(result.split(",")[1] ?? "");
    };
    reader.onerror = () => reject(reader.error ?? new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}

// ---------------- Admin ----------------

export const admin = {
  listCustomers() {
    return request<{ customers: AdminCustomer[] }>("/admin/customers");
  },
  setCustomerActive(customerId: string, active: boolean) {
    return request<{ ok: true }>(`/admin/customers/${customerId}/active`, {
      method: "POST",
      body: JSON.stringify({ active }),
    });
  },
  activateCustomer(customerId: string, days?: number) {
    return request<{ status: string; access_start: string; access_end: string }>(
      `/admin/customers/${customerId}/activate`,
      { method: "POST", body: JSON.stringify(days ? { days } : {}) },
    );
  },
  listPendingPayments() {
    return request<{ payments: AdminPayment[] }>("/admin/payments/pending");
  },
  approvePayment(paymentId: string) {
    return request<{ status: string; access_start: string; access_end: string }>(
      `/admin/payments/${paymentId}/approve`,
      { method: "POST" },
    );
  },
  rejectPayment(paymentId: string, reason: string) {
    return request<{ status: string; reason: string }>(`/admin/payments/${paymentId}/reject`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    });
  },
  tradingOverview() {
    return request<TradingOverview>("/admin/trading/overview");
  },
  setEmergencyStop(active: boolean) {
    return request<{ emergency_stop: boolean }>("/admin/emergency-stop", {
      method: "POST",
      body: JSON.stringify({ active }),
    });
  },
  systemHealth() {
    return request<SystemHealth>("/admin/system/health");
  },
};
