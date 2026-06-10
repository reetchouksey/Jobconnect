import { db } from './index.js';

const rows = db
  .prepare(
    `SELECT id, name, email, phone, location, headline,
            substr(password_hash, 1, 25) AS password_hash_preview,
            created_at, updated_at
     FROM users
     ORDER BY created_at DESC`,
  )
  .all();

console.log(`\n${rows.length} user row(s) in jobconnect.db:\n`);
console.log(JSON.stringify(rows, null, 2));
