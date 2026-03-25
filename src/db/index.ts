import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('mi-dia.db');

export function initDb() {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS journal_entries (
      id TEXT PRIMARY KEY NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      date TEXT NOT NULL,
      rawText TEXT NOT NULL,
      summary TEXT NOT NULL,
      mood TEXT,
      tags TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      dueDate TEXT,
      completed INTEGER NOT NULL,
      priority TEXT NOT NULL,
      relatedEntryId TEXT,
      relatedGoalId TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS reminders (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      remindAt TEXT NOT NULL,
      repeatType TEXT NOT NULL,
      priority TEXT NOT NULL,
      completed INTEGER NOT NULL,
      relatedEntryId TEXT,
      notificationId TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS goals (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      category TEXT NOT NULL,
      targetValue REAL,
      currentValue REAL NOT NULL,
      unit TEXT NOT NULL,
      targetDate TEXT,
      status TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT NOT NULL
    );
  `);
}
