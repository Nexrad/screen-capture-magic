import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";
import { Brand } from "@/components/app-shell";
import { api, errMsg } from "@/lib/api";
import { qk } from "@/lib/queries";

const search = z.object({
  redirect: z.string().optional(),
  mode: z.enum(["login", "register"]).optional(),
});

export const Route = createFileRoute("/login")({
  validateSearch: (s) => search.parse(s),
  ssr: false,
  head: () => ({
    meta: [
      { title: "Log in — CopyTrade Pro" },
      { name: "description", content: "Log in or create your CopyTrade Pro account to start copying Ab Marshall." },
      { property: "og:title", content: "Log in — CopyTrade Pro" },
      { property: "og:description", content: "Log in or create your CopyTrade Pro account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Login,
});

const field =
  "mt-1.5 w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-primary";

function Login() {
  const { redirect, mode: initialMode } = Route.useSearch();
  const [mode, setMode] = useState<"login" | "register">(initialMode ?? "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const qc = useQueryClient();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email.includes("@")) return setError("Please enter a valid email.");
    if (password.length < 8 && mode === "register")
      return setError("Password must be at least 8 characters.");
    setBusy(true);
    try {
      if (mode === "register") await api.register(email, password);
      else await api.login(email, password);
      const me = await api.me();
      qc.clear();
      qc.setQueryData(qk.me, me);
      const safe = redirect && redirect.startsWith("/") && !redirect.startsWith("//") ? redirect : null;
      if (safe) window.location.assign(safe);
      else navigate({ to: me.role === "admin" ? "/admin/dashboard" : "/app/dashboard" });
    } catch (err) {
      setError(mode === "login" ? `Login failed. ${errMsg(err)}` : `Sign up failed. ${errMsg(err)}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="card-surface w-full max-w-sm p-6">
        <Brand title="CopyTrade Pro" />
        <h1 className="mt-6 text-xl font-bold text-ink">
          {mode === "login" ? "Log in" : "Create your account"}
        </h1>
        <form onSubmit={submit} className="mt-5 space-y-4">
          <div>
            <label className="text-sm font-medium" htmlFor="email">Email</label>
            <input id="email" type="email" autoComplete="email" className={field} value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              className={field}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <button
            disabled={busy}
            className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
          >
            {busy ? (mode === "login" ? "Logging in..." : "Creating account...") : mode === "login" ? "Log in" : "Create account"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          {mode === "login" ? "New here? " : "Already have an account? "}
          <button
            onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(null); }}
            className="font-semibold text-primary hover:underline"
          >
            {mode === "login" ? "Create an account" : "Log in"}
          </button>
        </p>
      </div>
    </div>
  );
}
