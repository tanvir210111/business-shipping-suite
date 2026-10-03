import mysql from 'mysql2/promise';
import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let pool = null;
let sqliteDb = null;
let activeEngine = 'none';

export async function initDatabase() {
  const dbClient = process.env.DB_CLIENT || 'auto';

  // Attempt MySQL connection if 'auto' or 'mysql'
  if (dbClient === 'auto' || dbClient === 'mysql') {
    try {
      const mysqlConfig = {
        host: process.env.DB_HOST || '127.0.0.1',
        port: parseInt(process.env.DB_PORT || '3306', 10),
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'business_shipping_suite',
        waitForConnections: true,
        connectionLimit: 15,
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 10000
      };

      const testPool = mysql.createPool(mysqlConfig);
      // Quick test ping
      const connection = await testPool.getConnection();
      connection.release();
      pool = testPool;
      activeEngine = 'mysql';
      console.log(`[Database] Successfully connected to MySQL server (${mysqlConfig.host}:${mysqlConfig.port}/${mysqlConfig.database})`);
      return;
    } catch (err) {
      if (dbClient === 'mysql') {
        console.error('[Database ERROR] Failed to connect to MySQL:', err.message);
        throw err;
      }
      console.warn(`[Database] MySQL not reachable (${err.message}). Activating high-fidelity resilient development engine.`);
    }
  }

  // Resilient fallback engine
  const dataDir = path.resolve(__dirname, '../../database/data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  const dbFile = path.join(dataDir, 'business_shipping_suite.sqlite');

  await new Promise((resolve, reject) => {
    sqliteDb = new sqlite3.Database(dbFile, (err) => {
      if (err) return reject(err);
      activeEngine = 'sqlite';
      console.log(`[Database] Active Engine: Resilient High-Fidelity SQLite (${dbFile})`);
      resolve();
    });
  });

  // Enable foreign keys
  await query('PRAGMA foreign_keys = ON');
}

/**
 * Execute parameterized SQL query
 * @param {string} sql 
 * @param {Array} params 
 * @returns {Promise<Array>} results
 */
export async function query(sql, params = []) {
  if (activeEngine === 'mysql' && pool) {
    const [rows] = await pool.query(sql, params);
    return rows;
  }

  if (activeEngine === 'sqlite' && sqliteDb) {
    // Normalize MySQL syntax to SQLite if needed
    let normalizedSql = sql
      .replace(/AUTO_INCREMENT/gi, 'AUTOINCREMENT')
      .replace(/INT PRIMARY KEY AUTOINCREMENT/gi, 'INTEGER PRIMARY KEY AUTOINCREMENT')
      .replace(/BIGINT PRIMARY KEY AUTOINCREMENT/gi, 'INTEGER PRIMARY KEY AUTOINCREMENT')
      .replace(/TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP/gi, 'DATETIME DEFAULT CURRENT_TIMESTAMP')
      .replace(/TIMESTAMP DEFAULT CURRENT_TIMESTAMP/gi, 'DATETIME DEFAULT CURRENT_TIMESTAMP')
      .replace(/ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;/gi, ';')
      .replace(/ENUM\([^)]+\)/gi, 'TEXT');

    const trimmed = normalizedSql.trim().toUpperCase();

    if (trimmed.startsWith('SELECT') || trimmed.startsWith('PRAGMA') || trimmed.startsWith('SHOW') || trimmed.startsWith('DESC')) {
      return new Promise((resolve, reject) => {
        sqliteDb.all(normalizedSql, params, (err, rows) => {
          if (err) return reject(err);
          resolve(rows || []);
        });
      });
    } else {
      return new Promise((resolve, reject) => {
        sqliteDb.run(normalizedSql, params, function (err) {
          if (err) return reject(err);
          resolve({ insertId: this.lastID, affectedRows: this.changes });
        });
      });
    }
  }

  throw new Error('[Database] No active database engine. Call initDatabase() first.');
}

export function getEngine() {
  return activeEngine;
}
