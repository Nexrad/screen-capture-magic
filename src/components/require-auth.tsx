import { useEffect } from "react";
import type { ReactNode } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useCurrentUser } from "@/lib/auth";
import type { Role } from "@/lib/api";
import { PageSpinner } from "@/components/status";

/**
 * Gates its children behind a logged-in session (and, if `role` is given, a
 * specific role). Rendered purely client-side - the /app and /admin route
 * trees are marked `ssr: false` precisely so this check never has to run on
 * the server without the browser's session cookie.
 */
export function RequireAuth({ role, children }: { role?: Role; children: ReactNode }) {
  const { data: user, isPending } = useCurrentUser();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const authorized = !!user && (!role || user.role === role);

  useEffect(() => {
    if (isPending) return;
    if (!user) {
      navigate({ to: "/login", search: { redirect: pathname }, replace: true });
    } else if (role && user.role !== role) {
      navigate({ to: "/app/dashboard", replace: true });
    }
  }, [isPending, user, role, navigate, pathname]);

  if (isPending || !authorized) {
    return <PageSpinner />;
  }

  return <>{children}</>;
}
