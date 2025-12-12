// server/test-pg.js
import 'dotenv/config';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

(async () => {
  try {
    const r = await pool.query('SELECT now()');
    console.log('PG OK', r.rows);
    await pool.end();
  } catch (err) {
    console.error('PG ERROR', err);
    process.exit(1);
  }
})();
