import type { ReactNode } from "react";
import Link from "next/link";
import { logoutAdminAction } from "@/app/admin/actions";

export default function AdminShell({
  email,
  title,
  subtitle,
  children,
  action,
}: {
  email: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#050806] text-white">
      <div
        className="pointer-events-none fixed inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.10),transparent_65%)]"
        aria-hidden="true"
      />

      <header className="sticky top-0 z-40 border-b border-white/[0.07] bg-[#050806]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href="/admin" className="min-w-0">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 font-bold text-emerald-300">
                V
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-bold tracking-[0.16em] text-emerald-400">
                  VEF45 EA
                </p>

                <p className="truncate text-xs text-white/35">
                  Landing Manager
                </p>
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <div className="hidden rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-right sm:block">
              <p className="text-[10px] uppercase tracking-wider text-white/30">
                Administrator
              </p>

              <p className="max-w-48 truncate text-xs text-white/65">
                {email}
              </p>
            </div>

            <form action={logoutAdminAction}>
              <button
                type="submit"
                className="rounded-xl border border-white/[0.09] bg-white/[0.03] px-3.5 py-2.5 text-xs font-medium text-white/65 transition hover:bg-white/[0.07] hover:text-white"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </header>

      <section className="relative mx-auto max-w-7xl px-4 pb-12 pt-7 sm:px-6 sm:pt-10">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400/80">
              Control Panel
            </p>

            <h1 className="text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
              {title}
            </h1>

            {subtitle ? (
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/40">
                {subtitle}
              </p>
            ) : null}
          </div>

          {action ? (
            <div className="w-full shrink-0 sm:w-auto">
              {action}
            </div>
          ) : null}
        </div>

        <div className="mt-8">{children}</div>
      </section>
    </main>
  );
}
