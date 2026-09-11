import type { LandingPage } from "@/lib/landing-pages";

type FormAction = (
  formData: FormData
) => void | Promise<void>;

function FieldTitle({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-4">
      <h2 className="text-base font-semibold text-white/90">
        {title}
      </h2>

      {description ? (
        <p className="mt-1 text-xs leading-5 text-white/35">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export default function AdminPageForm({
  page,
  action,
  submitLabel,
}: {
  page?: LandingPage | null;
  action: FormAction;
  submitLabel: string;
}) {
  const inputClass =
    "w-full rounded-xl border border-white/[0.08] bg-black/25 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-emerald-400/50 focus:bg-black/35";

  return (
    <form action={action} className="space-y-4 pb-24 sm:pb-0">
      <section className="rounded-[22px] border border-white/[0.07] bg-[#090d0a] p-5 sm:p-6">
        <FieldTitle
          title="Page Details"
          description="Identify this campaign and define its public URL."
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-xs font-medium text-white/45">
              Page Name
            </span>

            <input
              name="name"
              required
              maxLength={120}
              defaultValue={page?.name || ""}
              placeholder="India Campaign"
              className={inputClass}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-medium text-white/45">
              URL Slug
            </span>

            <div className="flex overflow-hidden rounded-xl border border-white/[0.08] bg-black/25 focus-within:border-emerald-400/50">
              <span className="flex items-center border-r border-white/[0.06] px-3 text-xs text-white/25">
                /
              </span>

              <input
                name="slug"
                required
                maxLength={120}
                defaultValue={page?.slug || ""}
                placeholder="india"
                className="min-w-0 flex-1 bg-transparent px-3 py-3.5 font-mono text-sm text-white outline-none placeholder:text-white/20"
              />
            </div>
          </label>
        </div>
      </section>

      <section className="rounded-[22px] border border-white/[0.07] bg-[#090d0a] p-5 sm:p-6">
        <FieldTitle
          title="Campaign Content"
          description="Control where visitors go and what video they see."
        />

        <div className="space-y-5">
          <label className="block">
            <span className="mb-2 block text-xs font-medium text-white/45">
              CTA Destination URL
            </span>

            <input
              name="cta_url"
              type="url"
              required
              defaultValue={
                page?.ctaUrl === "#"
                  ? ""
                  : page?.ctaUrl || ""
              }
              placeholder="https://t.me/..."
              className={inputClass}
            />

            <span className="mt-2 block text-[11px] leading-5 text-white/25">
              Both CTA buttons on this landing page will use this destination.
            </span>
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-medium text-white/45">
              Video URL
            </span>

            <input
              name="video_url"
              type="url"
              defaultValue={page?.videoUrl || ""}
              placeholder="Vimeo or YouTube URL"
              className={inputClass}
            />

            <span className="mt-2 block text-[11px] leading-5 text-white/25">
              Vimeo and YouTube links are converted into embeds automatically.
            </span>
          </label>
        </div>
      </section>

      <section className="rounded-[22px] border border-white/[0.07] bg-[#090d0a] p-5 sm:p-6">
        <FieldTitle
          title="Tracking"
          description="Attach a campaign-specific Facebook Meta Pixel."
        />

        <label className="block">
          <span className="mb-2 block text-xs font-medium text-white/45">
            Meta Pixel
          </span>

          <textarea
            name="meta_pixel"
            rows={5}
            defaultValue={page?.metaPixelId || ""}
            placeholder="Pixel ID or full Meta Pixel code"
            className={`${inputClass} resize-y font-mono`}
          />

          <span className="mt-2 block text-[11px] leading-5 text-white/25">
            Enter the Pixel ID or paste the full Meta code. Leave empty to disable tracking for this page.
          </span>
        </label>

        {page?.metaPixelId ? (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-400/10 bg-emerald-400/[0.04] px-3.5 py-3">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />

            <p className="text-xs text-emerald-300/70">
              Meta Pixel currently active
            </p>
          </div>
        ) : null}
      </section>

      <section className="rounded-[22px] border border-white/[0.07] bg-[#090d0a] p-5 sm:p-6">
        <FieldTitle
          title="Publishing"
          description="Control whether the page is live and whether it serves the main domain."
        />

        <div className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-xs font-medium text-white/45">
              Status
            </span>

            <select
              name="status"
              defaultValue={page?.status || "active"}
              className={inputClass}
            >
              <option value="active">
                Active
              </option>

              <option value="inactive">
                Inactive
              </option>
            </select>
          </label>

          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/[0.07] bg-black/20 p-4">
            <input
              name="is_primary"
              type="checkbox"
              defaultChecked={Boolean(page?.isPrimary)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-emerald-400"
            />

            <span>
              <span className="block text-sm font-medium text-white/75">
                Primary Landing Page
              </span>

              <span className="mt-1 block text-xs leading-5 text-white/30">
                Use this campaign directly at vef45-ea.com instead of a campaign slug.
              </span>
            </span>
          </label>
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/[0.07] bg-[#050806]/95 p-3 backdrop-blur-xl sm:static sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          <button
            type="submit"
            className="flex min-h-12 w-full items-center justify-center rounded-xl bg-emerald-400 px-6 py-3.5 text-sm font-bold text-[#041007] transition hover:bg-emerald-300 sm:w-auto sm:min-w-44"
          >
            {submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
}
