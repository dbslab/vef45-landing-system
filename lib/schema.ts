import type { RowDataPacket } from "mysql2";
import pool from "@/lib/db";

let schemaPromise: Promise<void> | null = null;

async function setupSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS landing_pages (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      slug VARCHAR(120) NOT NULL UNIQUE,
      cta_url TEXT NOT NULL,
      video_url TEXT NULL,
      meta_pixel_id VARCHAR(50) NULL,
      status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
      is_primary BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  const [videoColumn] = await pool.query<RowDataPacket[]>(
    "SHOW COLUMNS FROM landing_pages LIKE 'video_url'"
  );

  if (videoColumn.length === 0) {
    await pool.query(`
      ALTER TABLE landing_pages
      ADD COLUMN video_url TEXT NULL AFTER cta_url
    `);
  }

  const [metaPixelColumn] = await pool.query<RowDataPacket[]>(
    "SHOW COLUMNS FROM landing_pages LIKE 'meta_pixel_id'"
  );

  if (metaPixelColumn.length === 0) {
    await pool.query(`
      ALTER TABLE landing_pages
      ADD COLUMN meta_pixel_id VARCHAR(50) NULL AFTER video_url
    `);
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(190) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS admin_sessions (
      token_hash CHAR(64) PRIMARY KEY,
      admin_id INT UNSIGNED NOT NULL,
      expires_at DATETIME NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_admin_sessions_expires (expires_at),
      CONSTRAINT fk_admin_sessions_user
        FOREIGN KEY (admin_id)
        REFERENCES admin_users(id)
        ON DELETE CASCADE
    )
  `);

  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT COUNT(*) AS total FROM landing_pages"
  );

  if (Number(rows[0]?.total || 0) === 0) {
    await pool.query(
      `
        INSERT INTO landing_pages
          (name, slug, cta_url, video_url, meta_pixel_id, status, is_primary)
        VALUES
          (?, ?, ?, ?, ?, 'active', TRUE)
      `,
      ["Main Landing Page", "main", "#", null, null]
    );
  }
}

export function ensureSchema() {
  if (!schemaPromise) {
    schemaPromise = setupSchema();
  }

  return schemaPromise;
}
