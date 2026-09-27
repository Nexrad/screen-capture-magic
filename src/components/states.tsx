export function Loading({ label = "Loading..." }: { label?: string }) {
  return <p className="py-10 text-center text-sm text-muted-foreground">{label}</p>;
}

export function ErrorBox({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="card-surface flex flex-wrap items-center justify-between gap-3 p-5">
      <p className="text-sm text-destructive">{message}</p>
      {onRetry ? (
        <button
          onClick={onRetry}
          className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold hover:bg-secondary"
        >
          Try again
        </button>
      ) : null}
    </div>
  );
}

export function Notice({ tone = "info", children }: { tone?: "info" | "good" | "bad"; children: React.ReactNode }) {
  const cls =
    tone === "good"
      ? "bg-success-soft text-success"
      : tone === "bad"
        ? "bg-destructive/10 text-destructive"
        : "bg-muted text-muted-foreground";
  return <p className={`mt-3 rounded-lg px-3 py-2 text-sm ${cls}`}>{children}</p>;
}
