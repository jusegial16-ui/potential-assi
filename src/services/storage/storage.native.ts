import { SQLiteDatabase } from 'expo-sqlite';

let db: SQLiteDatabase | null = null;

export async function getNativeDb(): Promise<SQLiteDatabase> {
  if (db) return db;
  const SQLite = await import('expo-sqlite');
  db = SQLite.openDatabaseSync('mi-dia.db');
  return db;
}
