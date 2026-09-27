import { useQuery } from "@tanstack/react-query";
import { api } from "./api";

export const qk = {
  me: ["me"] as const,
  status: ["customer", "status"] as const,
  orders: ["customer", "orders"] as const,
  payments: ["customer", "payments"] as const,
  adminCustomers: ["admin", "customers"] as const,
  adminPending: ["admin", "payments", "pending"] as const,
  adminOverview: ["admin", "overview"] as const,
  adminHealth: ["admin", "health"] as const,
};

export const useMe = () => useQuery({ queryKey: qk.me, queryFn: api.me, retry: false });
export const useStatus = () => useQuery({ queryKey: qk.status, queryFn: api.status, retry: false });
export const useOrders = () =>
  useQuery({ queryKey: qk.orders, queryFn: async () => (await api.orders()).orders, retry: false });
export const usePayments = () =>
  useQuery({ queryKey: qk.payments, queryFn: async () => (await api.payments()).payments, retry: false });
