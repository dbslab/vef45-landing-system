import { notFound } from "next/navigation";
import LandingPageView from "@/components/LandingPageView";
import { getLandingPageBySlug } from "@/lib/landing-pages";

export const dynamic = "force-dynamic";

export default async function CampaignPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const page = await getLandingPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return <LandingPageView page={page} />;
}
