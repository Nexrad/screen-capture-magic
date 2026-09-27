import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Brand } from "@/components/app-shell";
import { ErrorBanner } from "@/components/status";
import { useRegister } from "@/lib/auth";
import { ApiError } from "@/lib/api";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [{ title: "Create an account — CopyTrade Pro" }],
  }),
  component: Register,
});

const field =
  "mt-1.5 w-full rounded-lg border border-input bg-surface px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const register = useRegister();
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    register.mutate(
      { email, password },
      {
        onSuccess: () => {
          navigate({ to: "/app/dashboard" });
        },
      },
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex justify-center">
          <Brand title="CopyTrade Pro" />
        </div>
        <div className="card-surface p-6">
          <h1 className="text-xl font-bold text-ink">Create an account</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign up to connect your MT5 account and start copying signals.
          </p>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label className="text-sm font-medium" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                className={field}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={10}
                autoComplete="new-password"
                className={field}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p className="mt-1.5 text-xs text-muted-foreground">At least 10 characters.</p>
            </div>

            {register.isError ? (
              <ErrorBanner
                message={
                  register.error instanceof ApiError
                    ? register.error.message
                    : "Something went wrong. Please try again."
                }
              />
            ) : null}

            <button
              type="submit"
              disabled={register.isPending}
              className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
            >
              {register.isPending ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-primary hover:underline">
              Log in
            </Link>
          </p>
        </div>
        <p className="mt-4 text-center text-sm">
          <Link to="/" className="text-muted-foreground hover:text-foreground">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
