// ============================================
// DATABASE ABSTRACTION
// sql.js (pure-JS SQLite) for local dev, DynamoDB for AWS production
// ============================================

import path from 'path';
import fs from 'fs';

// ── sql.js (pure JavaScript SQLite) implementation ──

class SqlJsDB {
  constructor() {
    this._ready = null;
    this.db = null;
    this.dbPath = path.join(process.cwd(), 'data', 'sheets.db');
  }

  async _init() {
    if (this.db) return;
    if (this._ready) return this._ready;

    this._ready = (async () => {
      const initSqlJs = (await import('sql.js')).default;
      const SQL = await initSqlJs();

      const dataDir = path.dirname(this.dbPath);
      if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

      if (fs.existsSync(this.dbPath)) {
        const buffer = fs.readFileSync(this.dbPath);
        this.db = new SQL.Database(buffer);
      } else {
        this.db = new SQL.Database();
      }

      this.db.run(`
        CREATE TABLE IF NOT EXISTS sheets (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          slug TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          title TEXT DEFAULT '',
          data_json TEXT NOT NULL,
          creator_ip TEXT DEFAULT '',
          created_at TEXT DEFAULT (datetime('now'))
        );
      `);
      this.db.run(`CREATE INDEX IF NOT EXISTS idx_sheets_slug ON sheets(slug);`);
      this.db.run(`CREATE INDEX IF NOT EXISTS idx_sheets_ip ON sheets(creator_ip);`);

      // Jobs table for background processing
      this.db.run(`
        CREATE TABLE IF NOT EXISTS jobs (
          job_id TEXT PRIMARY KEY,
          status TEXT NOT NULL DEFAULT 'pending',
          cv_text TEXT,
          result_json TEXT,
          error TEXT,
          creator_ip TEXT DEFAULT '',
          created_at TEXT DEFAULT (datetime('now')),
          updated_at TEXT DEFAULT (datetime('now'))
        );
      `);

      // Migration: add creator_ip column if missing (existing DBs)
      try {
        this.db.run(`ALTER TABLE sheets ADD COLUMN creator_ip TEXT DEFAULT ''`);
        this._persist();
      } catch (e) {
        // Column already exists — ignore
      }

      this._persist();
    })();

    return this._ready;
  }

  _persist() {
    if (!this.db) return;
    try {
      const data = this.db.export();
      const buffer = Buffer.from(data);
      fs.writeFileSync(this.dbPath, buffer);
    } catch (e) {
      console.error('DB persist error:', e.message);
    }
  }

  async saveSheet(slug, name, title, dataJson, creatorIp) {
    await this._init();
    this.db.run(
      'INSERT INTO sheets (slug, name, title, data_json, creator_ip) VALUES (?, ?, ?, ?, ?)',
      [slug, name, title || '', JSON.stringify(dataJson), creatorIp || '']
    );
    this._persist();
    return { slug, createdAt: new Date().toISOString() };
  }

  async getSheet(slug) {
    await this._init();
    const stmt = this.db.prepare('SELECT * FROM sheets WHERE slug = ?');
    stmt.bind([slug]);
    if (!stmt.step()) { stmt.free(); return null; }
    const row = stmt.getAsObject();
    stmt.free();
    return {
      slug: row.slug,
      name: row.name,
      title: row.title,
      data: JSON.parse(row.data_json),
      createdAt: row.created_at,
    };
  }

  async listSheets(limit = 50, offset = 0) {
    await this._init();
    const results = [];
    const stmt = this.db.prepare(
      'SELECT slug, name, title, created_at FROM sheets ORDER BY created_at DESC LIMIT ? OFFSET ?'
    );
    stmt.bind([limit, offset]);
    while (stmt.step()) {
      const row = stmt.getAsObject();
      results.push({
        slug: row.slug,
        name: row.name,
        title: row.title,
        createdAt: row.created_at,
      });
    }
    stmt.free();
    return results;
  }

  async listSheetsByIP(ip, limit = 20) {
    await this._init();
    const results = [];
    const stmt = this.db.prepare(
      'SELECT slug, name, title, created_at FROM sheets WHERE creator_ip = ? ORDER BY created_at DESC LIMIT ?'
    );
    stmt.bind([ip, limit]);
    while (stmt.step()) {
      const row = stmt.getAsObject();
      results.push({
        slug: row.slug,
        name: row.name,
        title: row.title,
        createdAt: row.created_at,
      });
    }
    stmt.free();
    return results;
  }

  // Job methods for background processing
  async createJob(jobId, cvText, creatorIp) {
    await this._init();
    this.db.run(
      'INSERT INTO jobs (job_id, status, cv_text, creator_ip) VALUES (?, ?, ?, ?)',
      [jobId, 'pending', cvText, creatorIp || '']
    );
    this._persist();
    return { jobId, status: 'pending' };
  }

  async getJob(jobId) {
    await this._init();
    const stmt = this.db.prepare('SELECT * FROM jobs WHERE job_id = ?');
    stmt.bind([jobId]);
    if (!stmt.step()) { stmt.free(); return null; }
    const row = stmt.getAsObject();
    stmt.free();
    return {
      jobId: row.job_id,
      status: row.status,
      cvText: row.cv_text,
      result: row.result_json ? JSON.parse(row.result_json) : null,
      error: row.error,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async updateJobStatus(jobId, status, result = null, error = null) {
    await this._init();
    const now = new Date().toISOString();
    this.db.run(
      'UPDATE jobs SET status = ?, result_json = ?, error = ?, updated_at = ? WHERE job_id = ?',
      [status, result ? JSON.stringify(result) : null, error, now, jobId]
    );
    this._persist();
  }
}

// ── DynamoDB implementation ──────────────────
// ── Neon Postgres implementation ─────────────
// Serverless HTTP driver (@neondatabase/serverless): each tagged-template
// query is one HTTP request, ideal for Vercel functions. Schema is created
// lazily on first use (CREATE TABLE IF NOT EXISTS), so no manual migration.

import { neon } from '@neondatabase/serverless';

// Vercel's Neon marketplace integration injects several connection strings;
// prefer the pooled DATABASE_URL / POSTGRES_URL for the HTTP driver.
function pgConnectionString() {
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.DATABASE_URL_UNPOOLED ||
    null
  );
}

// Postgres timestamptz comes back as a string or Date depending on driver
// config; normalize to an ISO string to match the sql.js adapter's shape.
function toIso(v) {
  if (!v) return v;
  return v instanceof Date ? v.toISOString() : v;
}

class NeonDB {
  constructor() {
    this.sql = neon(pgConnectionString());
    this._ready = null;
  }

  async _init() {
    if (this._ready) return this._ready;
    this._ready = (async () => {
      await this.sql`
        CREATE TABLE IF NOT EXISTS sheets (
          id SERIAL PRIMARY KEY,
          slug TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          title TEXT DEFAULT '',
          data_json TEXT NOT NULL,
          creator_ip TEXT DEFAULT '',
          created_at TIMESTAMPTZ DEFAULT now()
        )`;
      await this.sql`CREATE INDEX IF NOT EXISTS idx_sheets_slug ON sheets(slug)`;
      await this.sql`CREATE INDEX IF NOT EXISTS idx_sheets_ip ON sheets(creator_ip)`;
      await this.sql`
        CREATE TABLE IF NOT EXISTS jobs (
          job_id TEXT PRIMARY KEY,
          status TEXT NOT NULL DEFAULT 'pending',
          cv_text TEXT,
          result_json TEXT,
          error TEXT,
          creator_ip TEXT DEFAULT '',
          created_at TIMESTAMPTZ DEFAULT now(),
          updated_at TIMESTAMPTZ DEFAULT now()
        )`;
    })();
    return this._ready;
  }

  async saveSheet(slug, name, title, dataJson, creatorIp) {
    await this._init();
    const rows = await this.sql`
      INSERT INTO sheets (slug, name, title, data_json, creator_ip)
      VALUES (${slug}, ${name}, ${title || ''}, ${JSON.stringify(dataJson)}, ${creatorIp || ''})
      RETURNING created_at`;
    return { slug, createdAt: toIso(rows[0]?.created_at) };
  }

  async getSheet(slug) {
    await this._init();
    const rows = await this.sql`SELECT * FROM sheets WHERE slug = ${slug} LIMIT 1`;
    if (!rows.length) return null;
    const row = rows[0];
    return {
      slug: row.slug,
      name: row.name,
      title: row.title,
      data: JSON.parse(row.data_json),
      createdAt: toIso(row.created_at),
    };
  }

  async listSheets(limit = 50, offset = 0) {
    await this._init();
    const rows = await this.sql`
      SELECT slug, name, title, created_at FROM sheets
      ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;
    return rows.map((r) => ({
      slug: r.slug,
      name: r.name,
      title: r.title,
      createdAt: toIso(r.created_at),
    }));
  }

  async listSheetsByIP(ip, limit = 20) {
    await this._init();
    const rows = await this.sql`
      SELECT slug, name, title, created_at FROM sheets
      WHERE creator_ip = ${ip} ORDER BY created_at DESC LIMIT ${limit}`;
    return rows.map((r) => ({
      slug: r.slug,
      name: r.name,
      title: r.title,
      createdAt: toIso(r.created_at),
    }));
  }

  async createJob(jobId, cvText, creatorIp) {
    await this._init();
    await this.sql`
      INSERT INTO jobs (job_id, status, cv_text, creator_ip)
      VALUES (${jobId}, 'pending', ${cvText}, ${creatorIp || ''})`;
    return { jobId, status: 'pending' };
  }

  async getJob(jobId) {
    await this._init();
    const rows = await this.sql`SELECT * FROM jobs WHERE job_id = ${jobId} LIMIT 1`;
    if (!rows.length) return null;
    const row = rows[0];
    return {
      jobId: row.job_id,
      status: row.status,
      cvText: row.cv_text,
      result: row.result_json ? JSON.parse(row.result_json) : null,
      error: row.error,
      createdAt: toIso(row.created_at),
      updatedAt: toIso(row.updated_at),
    };
  }

  async updateJobStatus(jobId, status, result = null, error = null) {
    await this._init();
    await this.sql`
      UPDATE jobs SET status = ${status},
        result_json = ${result ? JSON.stringify(result) : null},
        error = ${error}, updated_at = now()
      WHERE job_id = ${jobId}`;
  }
}

// ── Factory ──────────────────────────────────

let _db = null;

function getDB() {
  if (_db) return _db;
  // Use Neon when a Postgres connection string is present (Vercel/production);
  // DB_MODE=sqlite forces the local sql.js store even if one is set.
  if (process.env.DB_MODE !== 'sqlite' && pgConnectionString()) {
    _db = new NeonDB();
  } else {
    _db = new SqlJsDB();
  }
  return _db;
}

export { getDB };
