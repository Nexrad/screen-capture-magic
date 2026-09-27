import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Menu, X, TrendingUp, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCurrentUser, useLogout } from "@/lib/auth";

export type NavItem = { to: string; label: string; icon: React.ComponentType<{ className?: string }> };

export function AppShell({
  items,
  title,
  children,
}: {
  items: NavItem[];
  title: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { data: user } = useCurrentUser();
  const logout = useLogout();
  const navigate = useNavigate();

  const handleLogout = () => {
    setOpen(false);
    logout.mutate(undefined, {
      onSettled: () => navigate({ to: "/", replace: true }),
    });
  };

  const nav = (
    <nav className="flex flex-col gap-1">
      {items.map((item) => {
        const active = pathname === item.to;
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground hover:bg-secondary",
            )}
          >
            <Icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
      <button
        type="button"
        onClick={handleLogout}
        disabled={logout.isPending}
        className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-muted-foreground hover:bg-secondary disabled:opacity-60"
      >
        <LogOut className="size-4" />
        {logout.isPending ? "Logging out…" : "Logout"}
      </button>
    </nav>
  );

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col border-r border-sidebar-border bg-sidebar p-4 lg:flex">
        <Brand title={title} />
        {user ? (
          <p className="mt-4 truncate text-xs text-muted-foreground" title={user.email}>
            {user.email}
          </p>
        ) : null}
        <div className="mt-6">{nav}</div>
      </aside>

      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-sidebar px-4 py-3 lg:hidden">
        <Brand title={title} />
        <button
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
          className="rounded-md p-2 hover:bg-secondary"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </header>
      {open ? (
        <div className="border-b border-border bg-sidebar px-4 py-3 lg:hidden">{nav}</div>
      ) : null}

      <main className="px-4 py-6 lg:ml-60 lg:px-8 lg:py-8">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
    </div>
  );
}

export function Brand({ title }: { title: string }) {
  return (
    <Link to="/" className="flex items-center gap-2">
      <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <TrendingUp className="size-4" />
      </span>
      <span className="font-display text-sm font-bold text-ink">{title}</span>
    </Link>
  );
}
