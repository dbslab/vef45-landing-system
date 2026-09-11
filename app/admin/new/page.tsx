import Link from "next/link";
import { redirect } from "next/navigation";
import AdminPageForm from "@/components/AdminPageForm";
import AdminShell from "@/components/AdminShell";
import { createLandingPageAction } from "@/app/admin/actions";
import { getCurrentAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function NewLandingPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  const { error } = await searchParams;

  return (
    <AdminShell
      email={admin.email}
      title="New Landing Page"
      subtitle="Create a new campaign using the VEF45 landing template."
      action={
        <Link
          href="/admin"
          className="flex w-full items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white/60 transition hover:bg-white/[0.06] sm:w-auto"
        >
          ← Dashboard
        </Link>
      }
    >
      {error ? (
        <div className="mb-5 rounded-2xl border border-red-400/20 bg-red-400/[0.08] px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <div className="mx-auto max-w-3xl">
        <AdminPageForm
          action={createLandingPageAction}
          submitLabel="Create Landing Page"
        />
      </div>
    </AdminShell>
  );
}
