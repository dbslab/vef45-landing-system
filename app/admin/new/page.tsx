import Link from "next/link";
import { redirect } from "next/navigation";
import AdminPageForm from "@/components/AdminPageForm";
import { createLandingPageAction } from "@/app/admin/actions";
import { getCurrentAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function NewLandingPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (!(await getCurrentAdmin())) {
    redirect("/admin/login");
  }

  const { error } = await searchParams;

  return (
    <main className="min-h-screen bg-[#050705] px-6 py-10 text-white">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/admin"
          className="text-sm text-white/40 transition hover:text-white"
        >
          ← Back to Landing Pages
        </Link>

        <h1 className="mt-6 text-3xl font-semibold">
          New Landing Page
        </h1>

        <p className="mt-2 text-sm text-white/40">
          Create another campaign using the VEF45 landing page template.
        </p>

        {error ? (
          <div className="mt-6 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        ) : null}

        <div className="mt-8">
          <AdminPageForm
            action={createLandingPageAction}
            submitLabel="Create Landing Page"
          />
        </div>
      </div>
    </main>
  );
}
