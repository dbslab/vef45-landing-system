import Link from "next/link";
import { redirect } from "next/navigation";
import {
  deleteLandingPageAction,
  logoutAdminAction,
  makePrimaryAction,
  toggleLandingPageAction,
} from "@/app/admin/actions";
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

  return (
    <main className="min-h-screen bg-[#050705] text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-5">
          <div>
            <p className="font-semibold tracking-[0.2em] text-emerald-400">
              VEF45 EA
            </p>

            <p className="mt-1 text-sm text-white/40">
              Landing Page Manager
            </p>
          </div>

          <form action={logoutAdminAction}>
            <button
              type="submit"
              className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:bg-white/5"
            >
              Sign Out
            </button>
          </form>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm text-white/35">
              Signed in as {admin.email}
            </p>

            <h1 className="mt-2 text-3xl font-semibold">
              Landing Pages
            </h1>

            <p className="mt-2 text-sm text-white/40">
              Manage campaign URLs without rebuilding the site.
            </p>
          </div>

          <Link
            href="/admin/new"
            className="inline-flex items-center justify-center rounded-xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-black transition hover:bg-emerald-300"
          >
            + New Landing Page
          </Link>
        </div>

        {success ? (
          <div className="mt-7 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">
            {success}
          </div>
        ) : null}

        {error ? (
          <div className="mt-7 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        ) : null}

        <div className="mt-8 grid gap-5">
          {pages.map((page) => {
            const publicPath = page.isPrimary
              ? "/"
              : `/${page.slug}`;

            return (
              <article
                key={page.id}
                className="rounded-3xl border border-white/10 bg-white/[0.03] p-6"
              >
                <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-semibold">
                        {page.name}
                      </h2>

                      {page.isPrimary ? (
                        <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                          PRIMARY
                        </span>
                      ) : null}

                      <span
                        className={
                          page.status === "active"
                            ? "rounded-full bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300"
                            : "rounded-full bg-white/5 px-3 py-1 text-xs text-white/35"
                        }
                      >
                        {page.status.toUpperCase()}
                      </span>
                    </div>

                    <p className="mt-3 font-mono text-sm text-white/40">
                      {publicPath}
                    </p>

                    <div className="mt-5 grid gap-3 text-sm text-white/45">
                      <p className="break-all">
                        <span className="text-white/70">
                          CTA:
                        </span>{" "}
                        {page.ctaUrl}
                      </p>

                      <p className="break-all">
                        <span className="text-white/70">
                          Video:
                        </span>{" "}
                        {page.videoUrl || "Not added"}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={publicPath}
                      target="_blank"
                      className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/65 transition hover:bg-white/5"
                    >
                      View
                    </Link>

                    <Link
                      href={`/admin/${page.id}/edit`}
                      className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/65 transition hover:bg-white/5"
                    >
                      Edit
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
                        className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/65 transition hover:bg-white/5"
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
                          className="rounded-lg border border-emerald-400/20 px-4 py-2 text-sm text-emerald-300 transition hover:bg-emerald-400/10"
                        >
                          Make Primary
                        </button>
                      </form>
                    ) : null}

                    {!page.isPrimary ? (
                      <details className="relative">
                        <summary className="cursor-pointer list-none rounded-lg border border-red-400/15 px-4 py-2 text-sm text-red-300/70 transition hover:bg-red-400/5">
                          Delete
                        </summary>

                        <div className="absolute right-0 z-20 mt-2 w-60 rounded-xl border border-white/10 bg-[#0b0e0c] p-4 shadow-2xl">
                          <p className="text-xs leading-5 text-white/45">
                            Delete this landing page permanently?
                          </p>

                          <form
                            action={deleteLandingPageAction.bind(
                              null,
                              page.id
                            )}
                            className="mt-3"
                          >
                            <button
                              type="submit"
                              className="w-full rounded-lg bg-red-500/15 px-3 py-2 text-xs font-medium text-red-300"
                            >
                              Delete Permanently
                            </button>
                          </form>
                        </div>
                      </details>
                    ) : null}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
