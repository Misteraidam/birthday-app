require('dotenv').config();
const { Pool } = require('pg');

const DATABASE_URL = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL;
const pool = new Pool({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } });

async function migrate() {
    try {
        await pool.query('DROP TABLE IF EXISTS portals');
        console.log('Dropped old table');
        const create = `
    CREATE TABLE portals (
      id TEXT PRIMARY KEY,
      payload JSONB NOT NULL,
      pass_salt TEXT,
      pass_hash TEXT,
      pass_iterations INTEGER,
      pass_digest TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    );
    `;
        await pool.query(create);
        console.log('Created new table');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

migrate();
