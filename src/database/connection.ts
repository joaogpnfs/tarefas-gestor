import { initializeDatabase } from './schema';
import Database from 'better-sqlite3';

let db: Database.Database | null = null;

export function getDatabase(): Database.Database {
  if (!db) {
    const customPath = process.env.DATABASE_PATH;
    db = customPath ? initializeDatabase(customPath) : initializeDatabase();
  }
  return db;
}

export function closeDatabase(): void {
  if (db) {
    db.close();
    db = null;
  }
}
