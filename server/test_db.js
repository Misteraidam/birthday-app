require('dotenv').config();
const { Pool } = require('pg');

const DATABASE_URL = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL;
console.log('Testing connection to:', DATABASE_URL.split('@')[1]); // Log host only for safety

const pool = new Pool({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } });

async function test() {
    try {
        const res = await pool.query('SELECT NOW()');
        console.log('Success:', res.rows[0]);
        process.exit(0);
    } catch (err) {
        console.error('Connection failed:', err);
        process.exit(1);
    }
}

test();
