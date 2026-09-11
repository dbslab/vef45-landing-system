import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth";
import { logoutAdminAction } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  return (
    <main className="min-h-screen bg-[#050705] text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
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
        <p className="text-sm text-white/40">
          Signed in as {admin.email}
        </p>

        <h1 className="mt-3 text-3xl font-semibold">
          Landing Pages
        </h1>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-8">
          <p className="text-lg font-medium">
            Admin authentication is ready.
          </p>

          <p className="mt-2 text-white/45">
            Landing-page creation, editing, CTA management and video management will live here.
          </p>
        </div>
      </section>
    </main>
  );
}
