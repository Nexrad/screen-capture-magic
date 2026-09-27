import { cn } from "@/lib/utils";
import type { Status } from "@/lib/mock-data";
import type { ReactNode } from "react";

const toneDot: Record<Status, string> = {
  good: "bg-success",
  warn: "bg-warning",
  bad: "bg-destructive",
  idle: "bg-muted-foreground",
};

const toneChip: Record<Status, string> = {
  good: "bg-success-soft text-success",
  warn: "bg-warning-soft text-warning-foreground",
  bad: "bg-danger-soft text-destructive",
  idle: "bg-muted text-muted-foreground",
};

export function StatusBadge({
  tone = "good",
  children,
  className,
}: {
  tone?: Status;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        toneChip[tone],
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", toneDot[tone])} />
      {children}
    </span>
  );
}

export function StatRow({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: Status;
}) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <span className="text-sm text-muted-foreground">{label}</span>
      {tone ? (
        <StatusBadge tone={tone}>{value}</StatusBadge>
      ) : (
        <span className="text-sm font-medium">{value}</span>
      )}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="card-surface p-4">
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-ink">{value}</p>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold text-ink">{title}</h1>
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
