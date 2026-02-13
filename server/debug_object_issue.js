require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY || process.env.VITE_SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugData() {
    try {
        const { data: portals, error } = await supabase
            .from('portals')
            .select('id, payload');

        if (error) throw error;

        console.log('\n--- ALL PORTAL CATEGORIES ---');
        portals.forEach(p => {
            const type = p.payload?.celebrationType;
            console.log(`ID: ${p.id.padEnd(8)} | Type: ${typeof type === 'object' ? JSON.stringify(type) : String(type)}`);
        });
        console.log('---------------------------\n');

    } catch (err) {
        console.error('Error:', err.message);
    }
}

debugData();
