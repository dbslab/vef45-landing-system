import { notFound } from "next/navigation";
import LandingPageView from "@/components/LandingPageView";
import { getPrimaryLandingPage } from "@/lib/landing-pages";

export const dynamic = "force-dynamic";

export default async function Home() {
  const page = await getPrimaryLandingPage();

  if (!page) {
    notFound();
  }

  return <LandingPageView page={page} />;
}
