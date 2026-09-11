import type { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "@/lib/db";
import { ensureSchema } from "@/lib/schema";

export type LandingPageStatus = "active" | "inactive";

export type LandingPage = {
  id: number;
  name: string;
  slug: string;
  ctaUrl: string;
  videoUrl: string | null;
  metaPixelId: string | null;
  status: LandingPageStatus;
  isPrimary: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type LandingPageInput = {
  name: string;
  slug: string;
  ctaUrl: string;
  videoUrl: string | null;
  metaPixelId: string | null;
  status: LandingPageStatus;
  isPrimary: boolean;
};

function mapLandingPage(row: RowDataPacket): LandingPage {
  return {
    id: Number(row.id),
    name: String(row.name),
    slug: String(row.slug),
    ctaUrl: String(row.cta_url),
    videoUrl: row.video_url ? String(row.video_url) : null,
    metaPixelId: row.meta_pixel_id ? String(row.meta_pixel_id) : null,
    status: row.status === "inactive" ? "inactive" : "active",
    isPrimary: Boolean(row.is_primary),
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

export async function getAllLandingPages() {
  await ensureSchema();

  const [rows] = await pool.query<RowDataPacket[]>(`
    SELECT *
    FROM landing_pages
    ORDER BY is_primary DESC, created_at DESC
  `);

  return rows.map(mapLandingPage);
}

export async function getLandingPageById(id: number) {
  await ensureSchema();

  const [rows] = await pool.query<RowDataPacket[]>(
    `
      SELECT *
      FROM landing_pages
      WHERE id = ?
      LIMIT 1
    `,
    [id]
  );

  return rows.length ? mapLandingPage(rows[0]) : null;
}

export async function getPrimaryLandingPage() {
  await ensureSchema();

  const [rows] = await pool.query<RowDataPacket[]>(`
    SELECT *
    FROM landing_pages
    WHERE is_primary = TRUE
      AND status = 'active'
    LIMIT 1
  `);

  return rows.length ? mapLandingPage(rows[0]) : null;
}

export async function getLandingPageBySlug(slug: string) {
  await ensureSchema();

  const [rows] = await pool.query<RowDataPacket[]>(
    `
      SELECT *
      FROM landing_pages
      WHERE slug = ?
        AND status = 'active'
      LIMIT 1
    `,
    [slug]
  );

  return rows.length ? mapLandingPage(rows[0]) : null;
}

export async function createLandingPage(input: LandingPageInput) {
  await ensureSchema();

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    if (input.isPrimary) {
      await connection.query(
        "UPDATE landing_pages SET is_primary = FALSE"
      );
    }

    const [result] = await connection.execute<ResultSetHeader>(
      `
        INSERT INTO landing_pages
          (name, slug, cta_url, video_url, meta_pixel_id, status, is_primary)
        VALUES
          (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        input.name,
        input.slug,
        input.ctaUrl,
        input.videoUrl,
        input.metaPixelId,
        input.status,
        input.isPrimary,
      ]
    );

    await connection.commit();

    return result.insertId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function updateLandingPage(
  id: number,
  input: LandingPageInput
) {
  await ensureSchema();

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    if (input.isPrimary) {
      await connection.query(
        "UPDATE landing_pages SET is_primary = FALSE"
      );
    }

    await connection.execute(
      `
        UPDATE landing_pages
        SET
          name = ?,
          slug = ?,
          cta_url = ?,
          video_url = ?,
          meta_pixel_id = ?,
          status = ?,
          is_primary = ?
        WHERE id = ?
      `,
      [
        input.name,
        input.slug,
        input.ctaUrl,
        input.videoUrl,
        input.metaPixelId,
        input.status,
        input.isPrimary,
        id,
      ]
    );

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function setLandingPageStatus(
  id: number,
  status: LandingPageStatus
) {
  await ensureSchema();

  await pool.query(
    `
      UPDATE landing_pages
      SET status = ?
      WHERE id = ?
    `,
    [status, id]
  );
}

export async function makeLandingPagePrimary(id: number) {
  await ensureSchema();

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    await connection.query(
      "UPDATE landing_pages SET is_primary = FALSE"
    );

    await connection.query(
      `
        UPDATE landing_pages
        SET
          is_primary = TRUE,
          status = 'active'
        WHERE id = ?
      `,
      [id]
    );

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function deleteLandingPage(id: number) {
  await ensureSchema();

  const [rows] = await pool.query<RowDataPacket[]>(
    `
      SELECT is_primary
      FROM landing_pages
      WHERE id = ?
      LIMIT 1
    `,
    [id]
  );

  if (!rows.length) {
    return;
  }

  if (Boolean(rows[0].is_primary)) {
    throw new Error("The primary landing page cannot be deleted.");
  }

  await pool.query(
    "DELETE FROM landing_pages WHERE id = ?",
    [id]
  );
}
