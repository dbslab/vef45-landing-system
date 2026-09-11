import type { LandingPage } from "@/lib/landing-pages";
import { getVideoEmbedUrl } from "@/lib/video";

const marketLabels = [
  { text: "EUR/USD", className: "left-[5%] top-[16%]" },
  { text: "GBP/USD", className: "right-[7%] top-[20%]" },
  { text: "XAU/USD", className: "left-[12%] bottom-[18%]" },
  { text: "USD/JPY", className: "right-[13%] bottom-[24%]" },
  { text: "BUY", className: "left-[28%] top-[11%]" },
  { text: "SELL", className: "right-[29%] top-[33%]" },
];

const candles = [
  { className: "left-[18%] top-[28%] h-20" },
  { className: "left-[23%] top-[38%] h-12" },
  { className: "right-[19%] top-[43%] h-24" },
  { className: "right-[25%] top-[16%] h-14" },
  { className: "left-[38%] bottom-[12%] h-16" },
  { className: "right-[38%] bottom-[17%] h-20" },
];

export default function LandingPageView({
  page,
}: {
  page: LandingPage;
}) {
  const videoEmbedUrl = getVideoEmbedUrl(page.videoUrl);

  return (
    <main className="min-h-screen overflow-hidden bg-[#030604] text-white">
      <section className="relative flex min-h-[92vh] items-center justify-center overflow-hidden px-6 py-24">
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(34,197,94,0.15),transparent_38%),linear-gradient(to_bottom,#030604,#061008)]"
          aria-hidden="true"
        />

        <div
          className="market-grid absolute inset-0 opacity-30"
          aria-hidden="true"
        />

        <div
          className="hero-glow absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          aria-hidden="true"
        />

        {marketLabels.map((item, index) => (
          <div
            key={item.text}
            className={`market-float absolute hidden rounded-lg border border-emerald-400/15 bg-black/30 px-3 py-2 font-mono text-xs tracking-wider text-emerald-300/45 backdrop-blur-sm md:block ${item.className}`}
            style={{
              animationDelay: `${index * -1.4}s`,
            }}
            aria-hidden="true"
          >
            {item.text}
          </div>
        ))}

        {candles.map((item, index) => (
          <div
            key={index}
            className={`candle-float absolute hidden w-[7px] rounded-full bg-emerald-400/30 md:block ${item.className}`}
            style={{
              animationDelay: `${index * -1.1}s`,
            }}
            aria-hidden="true"
          >
            <span className="absolute left-1/2 top-[-14px] h-[calc(100%+28px)] w-px -translate-x-1/2 bg-emerald-300/20" />
          </div>
        ))}

        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <div className="mx-auto mb-7 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] px-4 py-2 text-xs font-semibold tracking-[0.24em] text-emerald-300">
            VEF45 EA
          </div>

          <h1 className="mx-auto max-w-4xl text-5xl font-semibold leading-[1.02] tracking-[-0.05em] sm:text-6xl lg:text-8xl">
            Trade Smarter.
            <span className="block text-emerald-400">
              Automate the Execution.
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-white/55 sm:text-lg">
            Rule-based trading automation built for traders who value speed,
            structure and disciplined execution.
          </p>

          <a
            href={page.ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="cta-pulse mt-10 inline-flex min-w-56 items-center justify-center rounded-full bg-emerald-400 px-8 py-4 text-sm font-bold tracking-wide text-black transition hover:scale-[1.03] hover:bg-emerald-300"
          >
            GET VEF45 EA
          </a>
        </div>

        <div
          className="absolute bottom-0 left-0 h-32 w-full bg-gradient-to-t from-[#030604] to-transparent"
          aria-hidden="true"
        />
      </section>

      <section className="relative px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <p className="text-xs font-semibold tracking-[0.28em] text-emerald-400">
              WATCH
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">
              See VEF45 EA in Action
            </h2>
          </div>

          <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] shadow-[0_30px_100px_rgba(0,0,0,0.55)]">
            <div className="aspect-video bg-[#070b08]">
              {videoEmbedUrl ? (
                <iframe
                  src={videoEmbedUrl}
                  title="VEF45 EA Video"
                  className="h-full w-full"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="flex h-full items-center justify-center p-8 text-center">
                  <div>
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/10 text-2xl text-emerald-300">
                      ▶
                    </div>

                    <p className="mt-5 text-sm text-white/35">
                      Add the campaign video from the VEF45 admin panel.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-10 text-center">
            <a
              href={page.ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-w-56 items-center justify-center rounded-full bg-emerald-400 px-8 py-4 text-sm font-bold tracking-wide text-black transition hover:scale-[1.03] hover:bg-emerald-300"
            >
              GET VEF45 EA
            </a>
          </div>
        </div>
      </section>

      <section className="relative border-y border-white/[0.06] bg-white/[0.015] px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-5xl text-center">
          <div className="metric-number text-6xl font-semibold tracking-[-0.06em] text-emerald-400 sm:text-8xl lg:text-9xl">
            100,000+
          </div>

          <p className="mt-5 text-sm font-semibold uppercase tracking-[0.28em] text-white/55 sm:text-base">
            VEF45 EA Users
          </p>
        </div>
      </section>

      <footer className="px-6 py-10 text-center text-sm text-white/35">
        © 2026 VEF45 EA
      </footer>
    </main>
  );
}
