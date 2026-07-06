import mysql from 'mysql2/promise';

let pool: mysql.Pool | null = null;

function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST ?? 'localhost',
      user: process.env.DB_USER!,
      password: process.env.DB_PASS!,
      database: process.env.DB_NAME!,
      waitForConnections: true,
      connectionLimit: 5,
    });
  }
  return pool;
}

async function ensureTable() {
  const db = getPool();
  await db.execute(`
    CREATE TABLE IF NOT EXISTS kv_store (
      \`key\` VARCHAR(255) PRIMARY KEY,
      value LONGTEXT NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);
}

export async function kvGet(key: string): Promise<unknown> {
  await ensureTable();
  const db = getPool();
  const [rows] = await db.execute('SELECT value FROM kv_store WHERE `key` = ?', [key]);
  const row = (rows as { value: string }[])[0];
  return row ? JSON.parse(row.value) : null;
}

export async function kvSet(key: string, value: unknown): Promise<void> {
  await ensureTable();
  const db = getPool();
  await db.execute(
    'INSERT INTO kv_store (`key`, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value = VALUES(value)',
    [key, JSON.stringify(value)]
  );
}
