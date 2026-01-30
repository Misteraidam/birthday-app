require('dotenv').config();
const { Pool } = require('pg');
const DATABASE_URL = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL;
const pool = new Pool({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } });

async function testInsert() {
    try {
        const id = 'test-' + Date.now();
        const payload = { test: true };
        await pool.query('INSERT INTO portals (id, payload) VALUES ($1, $2)', [id, payload]);
        console.log('Inserted:', id);
        const res = await pool.query('SELECT * FROM portals WHERE id = $1', [id]);
        console.log('Verified:', res.rows[0]);
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await pool.end();
    }
}
testInsert();
