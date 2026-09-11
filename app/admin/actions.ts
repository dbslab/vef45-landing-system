"use server";

import { redirect } from "next/navigation";
import {
  authenticateAdmin,
  createAdminSession,
  createFirstAdmin,
  destroyAdminSession,
  hasAdmin,
} from "@/lib/auth";

function errorRedirect(path: string, message: string): never {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

export async function setupAdminAction(formData: FormData) {
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();

  const password = String(formData.get("password") || "");

  if (await hasAdmin()) {
    redirect("/admin/login");
  }

  if (!email || !email.includes("@")) {
    errorRedirect("/admin/setup", "Enter a valid email address.");
  }

  if (password.length < 12) {
    errorRedirect(
      "/admin/setup",
      "Password must contain at least 12 characters."
    );
  }

  try {
    const adminId = await createFirstAdmin(email, password);
    await createAdminSession(adminId);
  } catch {
    errorRedirect(
      "/admin/setup",
      "Unable to create the admin account."
    );
  }

  redirect("/admin");
}

export async function loginAdminAction(formData: FormData) {
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();

  const password = String(formData.get("password") || "");

  const admin = await authenticateAdmin(email, password);

  if (!admin) {
    errorRedirect(
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
