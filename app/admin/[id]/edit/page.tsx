import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import AdminPageForm from "@/components/AdminPageForm";
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
  if (!(await getCurrentAdmin())) {
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
    <main className="min-h-screen bg-[#050705] px-6 py-10 text-white">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/admin"
          className="text-sm text-white/40 transition hover:text-white"
        >
          ← Back to Landing Pages
        </Link>

        <h1 className="mt-6 text-3xl font-semibold">
          Edit Landing Page
        </h1>

        <p className="mt-2 text-sm text-white/40">
          {page.name}
        </p>

        {error ? (
          <div className="mt-6 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        ) : null}

        <div className="mt-8">
          <AdminPageForm
            page={page}
            action={updateLandingPageAction.bind(
              null,
              page.id
            )}
            submitLabel="Save Changes"
          />
        </div>
      </div>
    </main>
  );
}
