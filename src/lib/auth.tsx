// src/lib/auth.tsx
//
// Thin React Query wrapper around the backend's session-cookie auth
// (see src/lib/api.ts). There is no second/local auth system here - every
// hook below just reads or mutates the one source of truth: the backend's
// `session_token` HttpOnly cookie, via /auth/*.
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "@/lib/api";
import type { User } from "@/lib/api";

export const CURRENT_USER_KEY = ["auth", "currentUser"] as const;

/** The logged-in user, or null when logged out. `isPending` is true only on the first check. */
export function useCurrentUser() {
  return useQuery({
    queryKey: CURRENT_USER_KEY,
    queryFn: api.getCurrentUserOrNull,
    staleTime: 60_000,
    retry: false,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      api.login(email, password),
    onSuccess: (user: User) => {
      queryClient.setQueryData(CURRENT_USER_KEY, user);
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      api.register(email, password),
    onSuccess: (result: { id: string; email: string }) => {
      // /auth/register always creates role="customer" and already set the
      // session cookie, so we can seed the cache directly instead of an
      // extra round trip to /auth/me.
      const user: User = { id: result.id, email: result.email, role: "customer" };
      queryClient.setQueryData(CURRENT_USER_KEY, user);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.logout,
    onSuccess: () => {
      queryClient.setQueryData(CURRENT_USER_KEY, null);
      queryClient.clear();
    },
  });
}
