import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

/**
 * Opens (and migrates) the SQLite database used by the API.
 * Pass { file: ":memory:" } for an ephemeral database (tests).
 */
export function openDatabase({ file }) {
  if (file !== ":memory:") {
    fs.mkdirSync(path.dirname(file), { recursive: true });
  }

  const db = new DatabaseSync(file);
  db.exec("PRAGMA journal_mode = WAL;");
  db.exec("PRAGMA busy_timeout = 5000;");
  db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        TEXT NOT NULL,
      email       TEXT NOT NULL,
      message     TEXT NOT NULL,
      ip          TEXT,
      user_agent  TEXT,
      created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
    );
  `);

  const insert = db.prepare(
    "INSERT INTO messages (name, email, message, ip, user_agent) VALUES (?, ?, ?, ?, ?)"
  );
  const list = db.prepare(
    "SELECT id, name, email, message, ip, user_agent, created_at FROM messages ORDER BY id DESC LIMIT ?"
  );
  const count = db.prepare("SELECT COUNT(*) AS n FROM messages");

  return {
    insertMessage({ name, email, message, ip = null, userAgent = null }) {
      const result = insert.run(name, email, message, ip, userAgent);
      return Number(result.lastInsertRowid);
    },
    listMessages(limit = 50) {
      return list.all(limit);
    },
    countMessages() {
      return Number(count.get().n);
    },
    close() {
      db.close();
    },
  };
}
