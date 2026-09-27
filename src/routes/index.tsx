import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  Repeat,
  SlidersHorizontal,
  Plug,
  UserCog,
} from "lucide-react";
import banner from "@/assets/challenge-banner.jpg.asset.json";
import { Brand } from "@/components/app-shell";
import { StatusBadge } from "@/components/status";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CopyTrade Pro — Copy Ab Marshall automatically" },
      {
        name: "description",
        content:
          "Connect your MT5 account and automatically copy Ab Marshall's Telegram trading signals. Join the $100 to $25,000 Ab Marshall Challenge.",
      },
      { property: "og:title", content: "CopyTrade Pro — Copy Ab Marshall automatically" },
      {
        property: "og:description",
        content:
          "Connect your MT5 account and automatically copy Ab Marshall's Telegram trading signals.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const steps = [
  { n: "01", title: "Create an account", body: "Sign up with your email and set up your CopyTrade Pro profile in under 3 minutes." },
  { n: "02", title: "Connect your MT5", body: "Enter your MT5 credentials once. Your account number and broker stay private." },
  { n: "03", title: "Set your risk", body: "Choose your lot size, maximum daily loss, and how many trades can be open at once." },
  { n: "04", title: "Copy automatically", body: "Every signal Ab Marshall sends on Telegram is copied instantly to your MT5 account." },
];

const reasons = [
  { icon: Repeat, title: "Automatic signal copying", body: "Signals from Telegram are copied to your MT5 account instantly — no manual entry." },
  { icon: SlidersHorizontal, title: "Simple risk controls", body: "Set your lot size, daily loss limit, and trade limits. You stay in control." },
  { icon: Plug, title: "MT5 integration", body: "Works with any broker that supports MetaTrader 5. Connect once and you're done." },
  { icon: UserCog, title: "Customer controlled", body: "Turn copying on or off whenever you want. Pause, resume, or change limits anytime." },
];

function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b border-border bg-surface/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Brand title="CopyTrade Pro" />
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <a href="#how" className="hover:text-foreground">How it works</a>
            <a href="#challenge" className="hover:text-foreground">Challenge</a>
            <a href="#why" className="hover:text-foreground">Why CopyTrade Pro</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link
              to="/app/dashboard"
              className="rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary"
            >
              Log in
            </Link>
            <Link
              to="/app/dashboard"
              className="rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 lg:grid-cols-2 lg:py-20">
        <div>
          <StatusBadge tone="good">Ab Marshall Challenge · live now</StatusBadge>
          <h1 className="mt-5 text-4xl font-bold text-ink sm:text-5xl">
            Copy Ab Marshall.
            <span className="block text-primary">Automatically.</span>
          </h1>
          <p className="mt-4 max-w-md text-base text-muted-foreground">
            Connect your MT5 account and let CopyTrade Pro copy every signal from Ab Marshall's
            Telegram channel — no manual trading required.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              to="/app/payment"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              Join the Challenge <ArrowRight className="size-4" />
            </Link>
            <a
              href="#how"
              className="rounded-lg border border-border bg-surface px-5 py-3 text-sm font-semibold text-foreground hover:bg-secondary"
            >
              How it works
            </a>
          </div>
          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
            {["No manual trading", "Works with any MT5 broker", "Instant signal copying"].map((t) => (
              <li key={t} className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-primary" /> {t}
              </li>
            ))}
          </ul>
        </div>
        <figure className="overflow-hidden rounded-xl border border-border shadow-lift">
          <img
            src={banner.url}
            alt="Ab Marshall Challenge — $100 to $25,000, live now"
            className="w-full"
            width={1382}
            height={778}
          />
        </figure>
      </section>

      <section id="how" className="border-y border-border bg-surface py-16">
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-center text-xs font-semibold tracking-widest text-primary uppercase">
            Simple by design
          </p>
          <h2 className="mt-2 text-center text-3xl font-bold text-ink">How it works</h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Four steps to start copying. No trading experience required.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <div key={s.n} className="card-surface p-5">
                <span className="font-display text-sm font-bold text-primary">{s.n}</span>
                <h3 className="mt-3 text-base font-semibold text-ink">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="challenge" className="mx-auto grid max-w-6xl gap-8 px-4 py-16 lg:grid-cols-2">
        <div>
          <StatusBadge tone="good">Live challenge</StatusBadge>
          <h2 className="mt-4 text-3xl font-bold text-ink">The Ab Marshall Challenge</h2>
          <p className="mt-3 max-w-md text-sm text-muted-foreground">
            Start with $100 and follow every signal from Ab Marshall — automatically copied to your
            MT5 account. The challenge target is $25,000. Join now and track progress in real time
            from your dashboard.
          </p>
          <Link
            to="/app/payment"
            className="mt-6 inline-flex rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            Join the Challenge
          </Link>
        </div>
        <div className="card-surface p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-ink">Challenge status</h3>
            <StatusBadge tone="good">Active</StatusBadge>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-4 border-t border-border pt-5">
            <div>
              <p className="text-2xl font-bold text-ink">$100</p>
              <p className="text-xs text-muted-foreground">Starting balance</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">$25,000</p>
              <p className="text-xs text-muted-foreground">Target</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-ink">25+</p>
              <p className="text-xs text-muted-foreground">Copying now</p>
            </div>
          </div>
          <p className="mt-5 text-xs text-muted-foreground">
            Challenge started September 27, 2026
          </p>
        </div>
      </section>

      <section id="why" className="border-y border-border bg-surface py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-3xl font-bold text-ink">Why CopyTrade Pro</h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Built for simplicity. Designed for beginners.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {reasons.map((r) => (
              <div key={r.title} className="card-surface p-5">
                <span className="inline-flex size-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <r.icon className="size-4" />
                </span>
                <h3 className="mt-3 text-base font-semibold text-ink">{r.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{r.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="rounded-xl border border-border bg-ink px-6 py-12 text-center">
          <h2 className="text-3xl font-bold text-background">Ready to start copying?</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
            Join the Ab Marshall Challenge today. Connect your MT5 account and start copying signals
            automatically.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              to="/app/payment"
              className="rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              Join the Challenge
            </Link>
            <a
              href="#how"
              className="rounded-lg border border-border px-5 py-3 text-sm font-semibold text-background hover:bg-foreground/10"
            >
              Learn more
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-surface">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-6">
          <Brand title="CopyTrade Pro" />
          <p className="text-xs text-muted-foreground">
            © 2026 CopyTrade Pro. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <Link to="/admin/dashboard" className="hover:text-foreground">Admin</Link>
            <a href="#why" className="hover:text-foreground">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
