import { db } from './index.js';

const tables = db
  .prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
  .all()
  .map((t) => t.name);
console.log('Tables in DB:', tables.join(', '));

if (!tables.includes('login_events')) {
  console.log('\n⚠️  login_events table missing.');
  process.exit(1);
}

const total = db.prepare('SELECT COUNT(*) AS n FROM login_events').get().n;
console.log(`\nlogin_events rows: ${total}`);

if (total > 0) {
  const recent = db
    .prepare(
      `SELECT id, user_id, email, event, success, reason, ip, created_at
       FROM login_events
       ORDER BY created_at DESC
       LIMIT 20`,
    )
    .all();
  console.log('\nMost recent 20 events:');
  console.log(JSON.stringify(recent, null, 2));
}
