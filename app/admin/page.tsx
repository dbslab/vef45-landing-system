import Link from "next/link";
import { redirect } from "next/navigation";
import {
  deleteLandingPageAction,
  makePrimaryAction,
  toggleLandingPageAction,
} from "@/app/admin/actions";
import AdminShell from "@/components/AdminShell";
import { getCurrentAdmin } from "@/lib/auth";
import { getAllLandingPages } from "@/lib/landing-pages";

export const dynamic = "force-dynamic";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{
    success?: string;
    error?: string;
  }>;
}) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  const pages = await getAllLandingPages();
  const { success, error } = await searchParams;

  const totalPages = pages.length;
  const activePages = pages.filter(
    (page) => page.status === "active"
  ).length;
  const pixelPages = pages.filter(
    (page) => Boolean(page.metaPixelId)
  ).length;

  return (
    <AdminShell
      email={admin.email}
      title="Landing Pages"
      subtitle="Manage campaigns, destinations, videos and tracking from one place."
      action={
        <Link
          href="/admin/new"
          className="flex w-full items-center justify-center rounded-2xl bg-emerald-400 px-5 py-3.5 text-sm font-bold text-[#041007] shadow-[0_12px_35px_rgba(52,211,153,0.12)] transition hover:bg-emerald-300 sm:w-auto"
        >
          + New Landing Page
        </Link>
      }
    >
      {success ? (
        <div className="mb-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.08] px-4 py-3 text-sm text-emerald-200">
          {success}
        </div>
      ) : null}

      {error ? (
        <div className="mb-5 rounded-2xl border border-red-400/20 bg-red-400/[0.08] px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 sm:p-5">
          <p className="text-[10px] font-medium uppercase tracking-wider text-white/30 sm:text-xs">
            Total
          </p>

          <p className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            {totalPages}
          </p>

          <p className="mt-1 hidden text-xs text-white/30 sm:block">
            Landing pages
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.035] p-4 sm:p-5">
          <p className="text-[10px] font-medium uppercase tracking-wider text-emerald-300/50 sm:text-xs">
            Active
          </p>

          <p className="mt-2 text-2xl font-semibold tracking-tight text-emerald-300 sm:text-3xl">
            {activePages}
          </p>

          <p className="mt-1 hidden text-xs text-white/30 sm:block">
            Live campaigns
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 sm:p-5">
          <p className="text-[10px] font-medium uppercase tracking-wider text-white/30 sm:text-xs">
            Pixel
          </p>

          <p className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            {pixelPages}
          </p>

          <p className="mt-1 hidden text-xs text-white/30 sm:block">
            Tracking enabled
          </p>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-white/90">
            Campaign Pages
          </h2>

          <p className="mt-1 text-xs text-white/30">
            {totalPages} {totalPages === 1 ? "page" : "pages"} configured
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        {pages.map((page) => {
          const publicPath = page.isPrimary
            ? "/"
            : `/${page.slug}`;

          return (
            <article
              key={page.id}
              className={`overflow-hidden rounded-[22px] border bg-[#090d0a] ${
                page.isPrimary
                  ? "border-emerald-400/20 shadow-[0_18px_60px_rgba(16,185,129,0.05)]"
                  : "border-white/[0.07]"
              }`}
            >
              <div className="p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      {page.isPrimary ? (
                        <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                          Primary
                        </span>
                      ) : null}

                      <span
                        className={
                          page.status === "active"
                            ? "rounded-full bg-emerald-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-300"
                            : "rounded-full bg-white/[0.05] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/35"
                        }
                      >
                        {page.status}
                      </span>
                    </div>

                    <h3 className="mt-3 truncate text-xl font-semibold tracking-tight">
                      {page.name}
                    </h3>
                  </div>

                  <Link
                    href={publicPath}
                    target="_blank"
                    className="shrink-0 rounded-xl border border-white/[0.08] bg-white/[0.025] px-3 py-2 text-xs font-medium text-white/55 transition hover:bg-white/[0.06] hover:text-white"
                  >
                    View ↗
                  </Link>
                </div>

                <div className="mt-4 rounded-xl border border-white/[0.06] bg-black/20 px-3.5 py-3">
                  <p className="text-[10px] uppercase tracking-wider text-white/25">
                    Public URL
                  </p>

                  <p className="mt-1 truncate font-mono text-xs text-emerald-300/80">
                    vef45-ea.com{publicPath}
                  </p>
                </div>

                <div className="mt-4 divide-y divide-white/[0.055] rounded-xl border border-white/[0.06]">
                  <div className="flex items-start justify-between gap-4 px-3.5 py-3">
                    <span className="shrink-0 text-xs text-white/35">
                      Destination
                    </span>

                    <span className="min-w-0 truncate text-right text-xs text-white/65">
                      {page.ctaUrl}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-4 px-3.5 py-3">
                    <span className="shrink-0 text-xs text-white/35">
                      Video
                    </span>

                    <span className="min-w-0 truncate text-right text-xs text-white/65">
                      {page.videoUrl ? "Configured" : "Not configured"}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-4 px-3.5 py-3">
                    <span className="shrink-0 text-xs text-white/35">
                      Meta Pixel
                    </span>

                    <span
                      className={
                        page.metaPixelId
                          ? "truncate text-right font-mono text-xs text-emerald-300/75"
                          : "text-right text-xs text-white/30"
                      }
                    >
                      {page.metaPixelId || "Not configured"}
                    </span>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-2.5">
                  <Link
                    href={`/admin/${page.id}/edit`}
                    className="flex min-h-11 items-center justify-center rounded-xl bg-white/[0.065] px-4 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/[0.1]"
                  >
                    Edit Page
                  </Link>

                  <form
                    action={toggleLandingPageAction.bind(
                      null,
                      page.id,
                      page.status
                    )}
                  >
                    <button
                      type="submit"
                      className="min-h-11 w-full rounded-xl border border-white/[0.08] px-4 py-3 text-sm font-medium text-white/55 transition hover:bg-white/[0.04]"
                    >
                      {page.status === "active"
                        ? "Disable"
                        : "Enable"}
                    </button>
                  </form>

                  {!page.isPrimary ? (
                    <form
                      action={makePrimaryAction.bind(
                        null,
                        page.id
                      )}
                    >
                      <button
                        type="submit"
                        className="min-h-11 w-full rounded-xl border border-emerald-400/15 bg-emerald-400/[0.04] px-3 py-3 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-400/[0.08]"
                      >
                        Make Primary
                      </button>
                    </form>
                  ) : (
                    <div className="flex min-h-11 items-center justify-center rounded-xl border border-emerald-400/10 bg-emerald-400/[0.025] px-3 text-xs text-emerald-300/50">
                      Main Page
                    </div>
                  )}

                  {!page.isPrimary ? (
                    <details className="relative">
                      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-center rounded-xl border border-red-400/10 px-3 py-3 text-xs font-medium text-red-300/60 transition hover:bg-red-400/[0.05]">
                        Delete
                      </summary>

                      <div className="absolute bottom-12 right-0 z-30 w-[min(280px,80vw)] rounded-2xl border border-white/[0.09] bg-[#101411] p-4 shadow-2xl">
                        <p className="text-sm font-medium">
                          Delete this page?
                        </p>

                        <p className="mt-1 text-xs leading-5 text-white/35">
                          This action cannot be undone.
                        </p>

                        <form
                          action={deleteLandingPageAction.bind(
                            null,
                            page.id
                          )}
                          className="mt-4"
                        >
                          <button
                            type="submit"
                            className="w-full rounded-xl bg-red-500/15 px-4 py-3 text-xs font-semibold text-red-300"
                          >
                            Delete Permanently
                          </button>
                        </form>
                      </div>
                    </details>
                  ) : (
                    <div className="flex min-h-11 items-center justify-center rounded-xl border border-white/[0.05] px-3 text-xs text-white/20">
                      Protected
                    </div>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </AdminShell>
  );
}
