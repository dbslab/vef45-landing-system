import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import AdminPageForm from "@/components/AdminPageForm";
import AdminShell from "@/components/AdminShell";
import { updateLandingPageAction } from "@/app/admin/actions";
import { getCurrentAdmin } from "@/lib/auth";
import { getLandingPageById } from "@/lib/landing-pages";

export const dynamic = "force-dynamic";

export default async function EditLandingPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const numericId = Number(id);

  if (!Number.isInteger(numericId)) {
    notFound();
  }

  const page = await getLandingPageById(numericId);

  if (!page) {
    notFound();
  }

  const { error } = await searchParams;

  return (
    <AdminShell
      email={admin.email}
      title={page.name}
      subtitle={`Editing /${page.slug}`}
      action={
        <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto">
          <Link
            href="/admin"
            className="flex items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-xs text-white/60 transition hover:bg-white/[0.06]"
          >
            ← Dashboard
          </Link>

          <Link
            href={page.isPrimary ? "/" : `/${page.slug}`}
            target="_blank"
            className="flex items-center justify-center rounded-xl border border-emerald-400/15 bg-emerald-400/[0.04] px-4 py-3 text-xs font-medium text-emerald-300"
          >
            View Page ↗
          </Link>
        </div>
      }
    >
      {error ? (
        <div className="mb-5 rounded-2xl border border-red-400/20 bg-red-400/[0.08] px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <div className="mx-auto max-w-3xl">
        <AdminPageForm
          page={page}
          action={updateLandingPageAction.bind(
            null,
            page.id
          )}
          submitLabel="Save Changes"
        />
      </div>
    </AdminShell>
  );
}
