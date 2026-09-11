import { redirect } from "next/navigation";
import { hasAdmin } from "@/lib/auth";
import { setupAdminAction } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function AdminSetupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await hasAdmin()) {
    redirect("/admin/login");
  }

  const { error } = await searchParams;

  return (
    <main className="min-h-screen bg-[#050705] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl">
        <div className="mb-8">
          <p className="text-sm font-semibold tracking-[0.25em] text-emerald-400">
            VEF45 EA
          </p>

          <h1 className="mt-3 text-3xl font-semibold">
            Create Admin
          </h1>

          <p className="mt-2 text-sm leading-6 text-white/50">
            Create the primary administrator account for the landing page manager.
          </p>
        </div>

        {error ? (
          <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        ) : null}

        <form action={setupAdminAction} className="space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm text-white/60">
              Email address
            </span>

            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none transition focus:border-emerald-400"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm text-white/60">
              Password
            </span>

            <input
              name="password"
              type="password"
              required
              minLength={12}
              autoComplete="new-password"
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none transition focus:border-emerald-400"
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-xl bg-emerald-400 px-5 py-3 font-semibold text-black transition hover:bg-emerald-300"
          >
            Create Admin Account
          </button>
        </form>
      </div>
    </main>
  );
}
