import type { LandingPage } from "@/lib/landing-pages";

type FormAction = (
  formData: FormData
) => void | Promise<void>;

export default function AdminPageForm({
  page,
  action,
  submitLabel,
}: {
  page?: LandingPage | null;
  action: FormAction;
  submitLabel: string;
}) {
  return (
    <form
      action={action}
      className="space-y-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8"
    >
      <label className="block">
        <span className="mb-2 block text-sm text-white/60">
          Page Name
        </span>

        <input
          name="name"
          required
          maxLength={120}
          defaultValue={page?.name || ""}
          placeholder="India Campaign"
          className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none transition focus:border-emerald-400"
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm text-white/60">
          Slug
        </span>

        <input
          name="slug"
          required
          maxLength={120}
          defaultValue={page?.slug || ""}
          placeholder="india"
          className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 font-mono outline-none transition focus:border-emerald-400"
        />

        <span className="mt-2 block text-xs text-white/30">
          Example: india creates /india
        </span>
      </label>

      <label className="block">
        <span className="mb-2 block text-sm text-white/60">
          CTA URL
        </span>

        <input
          name="cta_url"
          type="url"
          required
          defaultValue={page?.ctaUrl === "#" ? "" : page?.ctaUrl || ""}
          placeholder="https://t.me/..."
          className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none transition focus:border-emerald-400"
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm text-white/60">
          Video URL
        </span>

        <input
          name="video_url"
          type="url"
          defaultValue={page?.videoUrl || ""}
          placeholder="Vimeo, YouTube or embed URL"
          className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none transition focus:border-emerald-400"
        />

        <span className="mt-2 block text-xs text-white/30">
          Vimeo and YouTube normal links are converted automatically.
        </span>
      </label>

      <label className="block">
        <span className="mb-2 block text-sm text-white/60">
          Status
        </span>

        <select
          name="status"
          defaultValue={page?.status || "active"}
          className="w-full rounded-xl border border-white/10 bg-[#080b09] px-4 py-3 outline-none transition focus:border-emerald-400"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </label>

      <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-4 py-4">
        <input
          name="is_primary"
          type="checkbox"
          defaultChecked={Boolean(page?.isPrimary)}
          className="h-4 w-4 accent-emerald-400"
        />

        <span>
          <span className="block text-sm font-medium">
            Primary Landing Page
          </span>

          <span className="mt-1 block text-xs text-white/35">
            The primary page appears directly at vef45-ea.com
          </span>
        </span>
      </label>

      <button
        type="submit"
        className="rounded-xl bg-emerald-400 px-6 py-3 font-semibold text-black transition hover:bg-emerald-300"
      >
        {submitLabel}
      </button>
    </form>
  );
}
