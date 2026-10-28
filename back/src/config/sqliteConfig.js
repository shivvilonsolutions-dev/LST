import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

let sqliteDb = null;
let isOffline = false;

const getSqlitePath = () => {
  // Use app data directory or project directory
  const appDataPath = process.resourcesPath
    ? path.join(process.resourcesPath, 'app-data')
    : path.join(process.cwd(), 'app-data');

  if (!fs.existsSync(appDataPath)) {
    fs.mkdirSync(appDataPath, { recursive: true });
  }

  return path.join(appDataPath, 'lst-offline.db');
};

export const initSqlite = () => {
  if (sqliteDb) {
    return sqliteDb;
  }

  try {
    const dbPath = getSqlitePath();
    console.log('Initializing SQLite at:', dbPath);
    sqliteDb = new Database(dbPath);
    sqliteDb.pragma('journal_mode = WAL'); // Better performance

    // Create tables if they don't exist
    createTables();

    console.log('SQLite initialized successfully');
    isOffline = true;
    return sqliteDb;
  } catch (error) {
    console.error('SQLite initialization failed:', error.message);
    isOffline = false;
    return null;
  }
};

const createTables = () => {
  const tables = [
    'users',
    'clients',
    'quotations',
    'inventories',
    'settings'
  ];

  tables.forEach(tableName => {
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS ${tableName} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        data TEXT NOT NULL,
        userId TEXT NOT NULL,
        syncStatus TEXT DEFAULT 'pending',
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `;
    sqliteDb.exec(createTableSQL);

    // Create index for faster queries
    sqliteDb.exec(`CREATE INDEX IF NOT EXISTS idx_${tableName}_userId ON ${tableName}(userId)`);
    sqliteDb.exec(`CREATE INDEX IF NOT EXISTS idx_${tableName}_syncStatus ON ${tableName}(syncStatus)`);
  });
};

export const getSqliteDb = () => {
  if (!sqliteDb) {
    return initSqlite();
  }
  return sqliteDb;
};

export const closeSqlite = () => {
  if (sqliteDb) {
    sqliteDb.close();
    sqliteDb = null;
    isOffline = false;
  }
};

export const setOfflineStatus = (status) => {
  isOffline = status;
};

export const getOfflineStatus = () => {
  return isOffline;
};

export const insertDocument = (collection, userId, document) => {
  const db = getSqliteDb();
  const stmt = db.prepare(`
    INSERT INTO ${collection} (data, userId, syncStatus, createdAt, updatedAt)
    VALUES (?, ?, 'pending', datetime('now'), datetime('now'))
  `);
  const result = stmt.run(JSON.stringify(document), userId);
  return result.lastInsertRowid;
};

export const updateDocument = (collection, userId, document, uniqueField, uniqueValue) => {
  const db = getSqliteDb();
  const stmt = db.prepare(`
    UPDATE ${collection}
    SET data = ?, syncStatus = 'pending', updatedAt = datetime('now')
    WHERE userId = ? AND json_extract(data, '$.${uniqueField}') = ?
  `);
  const result = stmt.run(JSON.stringify(document), userId, JSON.stringify(uniqueValue));
  return result.changes > 0;
};

export const deleteDocument = (collection, userId, uniqueField, uniqueValue) => {
  const db = getSqliteDb();
  const stmt = db.prepare(`
    DELETE FROM ${collection}
    WHERE userId = ? AND json_extract(data, '$.${uniqueField}') = ?
  `);
  const result = stmt.run(userId, JSON.stringify(uniqueValue));
  return result.changes > 0;
};

export const findDocuments = (collection, userId) => {
  const db = getSqliteDb();
  const stmt = db.prepare(`
    SELECT data FROM ${collection}
    WHERE userId = ?
    ORDER BY createdAt DESC
  `);
  const rows = stmt.all(userId);
  return rows.map(row => JSON.parse(row.data));
};

export const findPendingDocuments = (collection) => {
  const db = getSqliteDb();
  const stmt = db.prepare(`
    SELECT id, data, userId FROM ${collection}
    WHERE syncStatus = 'pending'
    ORDER BY createdAt ASC
  `);
  return stmt.all();
};

export const markAsSynced = (collection, id) => {
  const db = getSqliteDb();
  const stmt = db.prepare(`
    UPDATE ${collection}
    SET syncStatus = 'synced', updatedAt = datetime('now')
    WHERE id = ?
  `);
  stmt.run(id);
};

export const clearCollection = (collection, userId) => {
  const db = getSqliteDb();
  const stmt = db.prepare(`
    DELETE FROM ${collection}
    WHERE userId = ?
  `);
  stmt.run(userId);
};
