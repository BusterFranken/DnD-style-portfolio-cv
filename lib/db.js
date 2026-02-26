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

class DynamoDBStore {
  constructor() {
    this._clientReady = null;
    this.docClient = null;
    this.tableName = process.env.DYNAMODB_TABLE || 'dnd-cv-sheets';
  }

  async _ensureClient() {
    if (this.docClient) return;
    if (this._clientReady) return this._clientReady;

    this._clientReady = (async () => {
      const { DynamoDBClient } = await import('@aws-sdk/client-dynamodb');
      const { DynamoDBDocumentClient } = await import('@aws-sdk/lib-dynamodb');
      const config = { region: process.env.DYNAMODB_REGION || 'eu-west-1' };
      // Support explicit credentials for Amplify (which reserves AWS_* prefix)
      if (process.env.DYNAMODB_ACCESS_KEY_ID && process.env.DYNAMODB_SECRET_ACCESS_KEY) {
        config.credentials = {
          accessKeyId: process.env.DYNAMODB_ACCESS_KEY_ID,
          secretAccessKey: process.env.DYNAMODB_SECRET_ACCESS_KEY,
        };
      }
      const client = new DynamoDBClient(config);
      this.docClient = DynamoDBDocumentClient.from(client);
    })();

    return this._clientReady;
  }

  async saveSheet(slug, name, title, dataJson, creatorIp) {
    await this._ensureClient();
    const { PutCommand } = await import('@aws-sdk/lib-dynamodb');
    const createdAt = new Date().toISOString();
    await this.docClient.send(new PutCommand({
      TableName: this.tableName,
      Item: {
        slug,
        name,
        title: title || '',
        data_json: JSON.stringify(dataJson),
        creator_ip: creatorIp || '',
        created_at: createdAt,
      },
    }));
    return { slug, createdAt };
  }

  async getSheet(slug) {
    await this._ensureClient();
    const { GetCommand } = await import('@aws-sdk/lib-dynamodb');
    const result = await this.docClient.send(new GetCommand({
      TableName: this.tableName,
      Key: { slug },
    }));
    if (!result.Item) return null;
    return {
      slug: result.Item.slug,
      name: result.Item.name,
      title: result.Item.title,
      data: JSON.parse(result.Item.data_json),
      createdAt: result.Item.created_at,
    };
  }

  async listSheets(limit = 50) {
    await this._ensureClient();
    const { ScanCommand } = await import('@aws-sdk/lib-dynamodb');
    const result = await this.docClient.send(new ScanCommand({
      TableName: this.tableName,
      FilterExpression: 'NOT begins_with(slug, :jobPrefix)',
      ExpressionAttributeValues: { ':jobPrefix': 'job_' },
      ProjectionExpression: 'slug, #n, title, created_at',
      ExpressionAttributeNames: { '#n': 'name' },
      Limit: limit,
    }));
    const items = (result.Items || []).map(i => ({
      slug: i.slug,
      name: i.name,
      title: i.title,
      createdAt: i.created_at,
    }));
    items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return items;
  }

  async listSheetsByIP(ip, limit = 20) {
    await this._ensureClient();
    const { ScanCommand } = await import('@aws-sdk/lib-dynamodb');
    const result = await this.docClient.send(new ScanCommand({
      TableName: this.tableName,
      FilterExpression: 'creator_ip = :ip AND NOT begins_with(slug, :jobPrefix)',
      ExpressionAttributeValues: { ':ip': ip, ':jobPrefix': 'job_' },
      ProjectionExpression: 'slug, #n, title, created_at',
      ExpressionAttributeNames: { '#n': 'name' },
      Limit: limit,
    }));
    const items = (result.Items || []).map(i => ({
      slug: i.slug,
      name: i.name,
      title: i.title,
      createdAt: i.created_at,
    }));
    items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return items;
  }

  // Job methods for background processing
  // Note: Jobs use "job_" prefix on slug to differentiate from sheets
  async createJob(jobId, cvText, creatorIp) {
    await this._ensureClient();
    const { PutCommand } = await import('@aws-sdk/lib-dynamodb');
    const now = new Date().toISOString();
    await this.docClient.send(new PutCommand({
      TableName: this.tableName,
      Item: {
        slug: `job_${jobId}`,
        job_id: jobId,
        status: 'pending',
        cv_text: cvText,
        creator_ip: creatorIp || '',
        created_at: now,
        updated_at: now,
      },
    }));
    return { jobId, status: 'pending' };
  }

  async getJob(jobId) {
    await this._ensureClient();
    const { GetCommand } = await import('@aws-sdk/lib-dynamodb');
    const result = await this.docClient.send(new GetCommand({
      TableName: this.tableName,
      Key: { slug: `job_${jobId}` },
    }));
    if (!result.Item) return null;
    return {
      jobId: result.Item.job_id,
      status: result.Item.status,
      cvText: result.Item.cv_text,
      result: result.Item.result_json ? JSON.parse(result.Item.result_json) : null,
      error: result.Item.error,
      createdAt: result.Item.created_at,
      updatedAt: result.Item.updated_at,
    };
  }

  async updateJobStatus(jobId, status, result = null, error = null) {
    await this._ensureClient();
    const { UpdateCommand } = await import('@aws-sdk/lib-dynamodb');
    const now = new Date().toISOString();
    await this.docClient.send(new UpdateCommand({
      TableName: this.tableName,
      Key: { slug: `job_${jobId}` },
      UpdateExpression: 'SET #s = :status, result_json = :result, #e = :error, updated_at = :now',
      ExpressionAttributeNames: { '#s': 'status', '#e': 'error' },
      ExpressionAttributeValues: {
        ':status': status,
        ':result': result ? JSON.stringify(result) : null,
        ':error': error,
        ':now': now,
      },
    }));
  }
}

// ── Factory ──────────────────────────────────

let _db = null;

function getDB() {
  if (_db) return _db;
  if (process.env.DB_MODE === 'dynamodb') {
    _db = new DynamoDBStore();
  } else {
    _db = new SqlJsDB();
  }
  return _db;
}

export { getDB };
