import crypto from "node:crypto";
import { cookies } from "next/headers";
import { compare, hash } from "bcryptjs";
import type { RowDataPacket } from "mysql2";
import pool from "@/lib/db";
import { ensureSchema } from "@/lib/schema";

const SESSION_COOKIE = "vef45_admin_session";
const SESSION_DAYS = 7;

type AdminUser = {
  id: number;
  email: string;
};

function hashSessionToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function hasAdmin() {
  await ensureSchema();

  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT COUNT(*) AS total FROM admin_users"
  );

  return Number(rows[0]?.total || 0) > 0;
}

export async function createFirstAdmin(email: string, password: string) {
  await ensureSchema();

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [existing] = await connection.query<RowDataPacket[]>(
      "SELECT COUNT(*) AS total FROM admin_users FOR UPDATE"
    );

    if (Number(existing[0]?.total || 0) > 0) {
      throw new Error("Admin account already exists.");
    }

    const passwordHash = await hash(password, 12);

    const [result] = await connection.execute(
      "INSERT INTO admin_users (email, password_hash) VALUES (?, ?)",
      [email.toLowerCase(), passwordHash]
    );

    await connection.commit();

    return Number((result as { insertId: number }).insertId);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function authenticateAdmin(email: string, password: string) {
  await ensureSchema();

  const [rows] = await pool.query<RowDataPacket[]>(
    `
      SELECT id, email, password_hash
      FROM admin_users
      WHERE email = ?
      LIMIT 1
    `,
    [email.toLowerCase()]
  );

  if (rows.length === 0) {
    return null;
  }

  const valid = await compare(password, String(rows[0].password_hash));

  if (!valid) {
    return null;
  }

  return {
    id: Number(rows[0].id),
    email: String(rows[0].email),
  };
}

export async function createAdminSession(adminId: number) {
  await ensureSchema();

  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashSessionToken(rawToken);

  const expiresAt = new Date(
    Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000
  );

  await pool.query(
    "DELETE FROM admin_sessions WHERE expires_at <= NOW()"
  );

  await pool.query(
    `
      INSERT INTO admin_sessions
        (token_hash, admin_id, expires_at)
      VALUES
        (?, ?, ?)
    `,
    [tokenHash, adminId, expiresAt]
  );

  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, rawToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function getCurrentAdmin(): Promise<AdminUser | null> {
  await ensureSchema();

  const cookieStore = await cookies();
  const rawToken = cookieStore.get(SESSION_COOKIE)?.value;

  if (!rawToken) {
    return null;
  }

  const tokenHash = hashSessionToken(rawToken);

  const [rows] = await pool.query<RowDataPacket[]>(
    `
      SELECT
        u.id,
        u.email
      FROM admin_sessions s
      INNER JOIN admin_users u
        ON u.id = s.admin_id
      WHERE
        s.token_hash = ?
        AND s.expires_at > NOW()
      LIMIT 1
    `,
    [tokenHash]
  );

  if (rows.length === 0) {
    return null;
  }

  return {
    id: Number(rows[0].id),
    email: String(rows[0].email),
  };
}

export async function destroyAdminSession() {
  const cookieStore = await cookies();
  const rawToken = cookieStore.get(SESSION_COOKIE)?.value;

  if (rawToken) {
    const tokenHash = hashSessionToken(rawToken);

    await pool.query(
      "DELETE FROM admin_sessions WHERE token_hash = ?",
      [tokenHash]
    );
  }

  cookieStore.delete(SESSION_COOKIE);
}
