require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY || process.env.VITE_SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function listPortals() {
    try {
        const { data: portals, error } = await supabase
            .from('portals')
            .select('id, views, created_at, payload')
            .order('created_at', { ascending: false })
            .limit(10);

        if (error) throw error;

        console.log('\n--- PORTAL INSIGHTS ---');
        if (!portals?.length) {
            console.log('No portals found.');
        } else {
            for (const p of portals) {
                const recipient = p.payload?.recipientName || 'Unknown';
                const sender = p.payload?.senderName || 'Anonymous';
                const type = p.payload?.celebrationType || 'general';
                const views = p.views || 0;
                const date = new Date(p.created_at).toLocaleDateString();
                const theme = p.payload?.template || 'default';
                console.log(`ID: ${p.id} | ${type.toUpperCase()} | Views: ${views} | ${sender} -> ${recipient} | Theme: ${theme} | ${date}`);
            }
        }
        console.log('-----------------------\n');
    } catch (err) {
        console.error('Error:', err.message);
    }
}

listPortals();
