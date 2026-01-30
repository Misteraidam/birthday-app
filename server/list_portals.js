require('dotenv').config();
const { Pool } = require('pg');
const DATABASE_URL = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL;
const pool = new Pool({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } });

async function listPortals() {
    try {
        const res = await pool.query('SELECT id, created_at FROM portals ORDER BY created_at DESC LIMIT 5');
        console.log('Recent Portals:', res.rows);
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await pool.end();
    }
}
listPortals();
