import { redirect } from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import { api, ApiError, type Me } from "./api";
import { qk } from "./queries";

// Runs in the browser only (layout routes use ssr: false). The backend stays the authority:
// every API call is re-checked there; this just keeps signed-out users off protected pages.
export async function requireUser(queryClient: QueryClient, href: string, role?: "admin"): Promise<Me> {
  let me: Me;
  try {
    me = await queryClient.fetchQuery({ queryKey: qk.me, queryFn: api.me, staleTime: 30_000 });
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) {
      throw redirect({ to: "/login", search: { redirect: href } });
    }
    throw e;
  }
  if (role === "admin" && me.role !== "admin") throw redirect({ to: "/app/dashboard" });
  return me;
}
