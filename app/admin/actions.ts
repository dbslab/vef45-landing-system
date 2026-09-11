"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  authenticateAdmin,
  createAdminSession,
  createFirstAdmin,
  destroyAdminSession,
  getCurrentAdmin,
  hasAdmin,
} from "@/lib/auth";
import {
  createLandingPage,
  deleteLandingPage,
  makeLandingPagePrimary,
  setLandingPageStatus,
  updateLandingPage,
  type LandingPageStatus,
} from "@/lib/landing-pages";

function redirectError(
  path: string,
  message: string
): never {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

function normalizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function validHttpUrl(value: string) {
  try {
    const url = new URL(value);

    return (
      url.protocol === "http:" ||
      url.protocol === "https:"
    );
  } catch {
    return false;
  }
}

function extractMetaPixelId(value: string) {
  const input = value.trim();

  if (!input) {
    return null;
  }

  if (/^\d{5,30}$/.test(input)) {
    return input;
  }

  const patterns = [
    /fbq\s*\(\s*['"]init['"]\s*,\s*['"](\d{5,30})['"]/i,
    /[?&]id=(\d{5,30})/i,
  ];

  for (const pattern of patterns) {
    const match = input.match(pattern);

    if (match?.[1]) {
      return match[1];
    }
  }

  return null;
}

async function requireAdmin() {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  return admin;
}

function isDuplicateError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "ER_DUP_ENTRY"
  );
}

export async function setupAdminAction(
  formData: FormData
) {
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();

  const password = String(
    formData.get("password") || ""
  );

  if (await hasAdmin()) {
    redirect("/admin/login");
  }

  if (!email || !email.includes("@")) {
    redirectError(
      "/admin/setup",
      "Enter a valid email address."
    );
  }

  if (password.length < 12) {
    redirectError(
      "/admin/setup",
      "Password must contain at least 12 characters."
    );
  }

  try {
    const adminId = await createFirstAdmin(
      email,
      password
    );

    await createAdminSession(adminId);
  } catch {
    redirectError(
      "/admin/setup",
      "Unable to create the admin account."
    );
  }

  redirect("/admin");
}

export async function loginAdminAction(
  formData: FormData
) {
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();

  const password = String(
    formData.get("password") || ""
  );

  const admin = await authenticateAdmin(
    email,
    password
  );

  if (!admin) {
    redirectError(
      "/admin/login",
      "Invalid email address or password."
    );
  }

  await createAdminSession(admin.id);

  redirect("/admin");
}

export async function logoutAdminAction() {
  await destroyAdminSession();

  redirect("/admin/login");
}

export async function createLandingPageAction(
  formData: FormData
) {
  await requireAdmin();

  const name = String(
    formData.get("name") || ""
  ).trim();

  const slug = normalizeSlug(
    String(formData.get("slug") || "")
  );

  const ctaUrl = String(
    formData.get("cta_url") || ""
  ).trim();

  const videoValue = String(
    formData.get("video_url") || ""
  ).trim();

  const videoUrl = videoValue || null;

  const metaPixelInput = String(
    formData.get("meta_pixel") || ""
  ).trim();

  const metaPixelId = extractMetaPixelId(
    metaPixelInput
  );

  const status: LandingPageStatus =
    formData.get("status") === "inactive"
      ? "inactive"
      : "active";

  const isPrimary =
    formData.get("is_primary") === "on";

  if (!name) {
    redirectError(
      "/admin/new",
      "Page name is required."
    );
  }

  if (!slug) {
    redirectError(
      "/admin/new",
      "Enter a valid slug."
    );
  }

  if (!validHttpUrl(ctaUrl)) {
    redirectError(
      "/admin/new",
      "Enter a valid CTA URL."
    );
  }

  if (videoUrl && !validHttpUrl(videoUrl)) {
    redirectError(
      "/admin/new",
      "Enter a valid video URL."
    );
  }

  if (metaPixelInput && !metaPixelId) {
    redirectError(
      "/admin/new",
      "Enter a valid Meta Pixel ID or paste the full Meta Pixel code."
    );
  }

  try {
    await createLandingPage({
      name,
      slug,
      ctaUrl,
      videoUrl,
      metaPixelId,
      status,
      isPrimary,
    });
  } catch (error) {
    if (isDuplicateError(error)) {
      redirectError(
        "/admin/new",
        "That slug is already being used."
      );
    }

    redirectError(
      "/admin/new",
      "Unable to create landing page."
    );
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath(`/${slug}`);

  redirect(
    "/admin?success=Landing%20page%20created"
  );
}

export async function updateLandingPageAction(
  id: number,
  formData: FormData
) {
  await requireAdmin();

  const name = String(
    formData.get("name") || ""
  ).trim();

  const slug = normalizeSlug(
    String(formData.get("slug") || "")
  );

  const ctaUrl = String(
    formData.get("cta_url") || ""
  ).trim();

  const videoValue = String(
    formData.get("video_url") || ""
  ).trim();

  const videoUrl = videoValue || null;

  const metaPixelInput = String(
    formData.get("meta_pixel") || ""
  ).trim();

  const metaPixelId = extractMetaPixelId(
    metaPixelInput
  );

  const status: LandingPageStatus =
    formData.get("status") === "inactive"
      ? "inactive"
      : "active";

  const isPrimary =
    formData.get("is_primary") === "on";

  const errorPath = `/admin/${id}/edit`;

  if (!name) {
    redirectError(
      errorPath,
      "Page name is required."
    );
  }

  if (!slug) {
    redirectError(
      errorPath,
      "Enter a valid slug."
    );
  }

  if (!validHttpUrl(ctaUrl)) {
    redirectError(
      errorPath,
      "Enter a valid CTA URL."
    );
  }

  if (videoUrl && !validHttpUrl(videoUrl)) {
    redirectError(
      errorPath,
      "Enter a valid video URL."
    );
  }

  if (metaPixelInput && !metaPixelId) {
    redirectError(
      errorPath,
      "Enter a valid Meta Pixel ID or paste the full Meta Pixel code."
    );
  }

  try {
    await updateLandingPage(id, {
      name,
      slug,
      ctaUrl,
      videoUrl,
      metaPixelId,
      status,
      isPrimary,
    });
  } catch (error) {
    if (isDuplicateError(error)) {
      redirectError(
        errorPath,
        "That slug is already being used."
      );
    }

    redirectError(
      errorPath,
      "Unable to update landing page."
    );
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath(`/${slug}`);

  redirect(
    "/admin?success=Landing%20page%20updated"
  );
}

export async function toggleLandingPageAction(
  id: number,
  currentStatus: LandingPageStatus
) {
  await requireAdmin();

  const nextStatus: LandingPageStatus =
    currentStatus === "active"
      ? "inactive"
      : "active";

  await setLandingPageStatus(id, nextStatus);

  revalidatePath("/");
  revalidatePath("/admin");

  redirect("/admin");
}

export async function makePrimaryAction(
  id: number
) {
  await requireAdmin();

  await makeLandingPagePrimary(id);

  revalidatePath("/");
  revalidatePath("/admin");

  redirect(
    "/admin?success=Primary%20page%20updated"
  );
}

export async function deleteLandingPageAction(
  id: number
) {
  await requireAdmin();

  try {
    await deleteLandingPage(id);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to delete landing page.";

    redirectError("/admin", message);
  }

  revalidatePath("/");
  revalidatePath("/admin");

  redirect(
    "/admin?success=Landing%20page%20deleted"
  );
}
