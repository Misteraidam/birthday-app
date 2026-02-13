require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY || process.env.VITE_SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function getSiteStats() {
    try {
        // Select views and payload (which contains the celebrationType)
        const { data: portals, error } = await supabase
            .from('portals')
            .select('views, payload');

        if (error) throw error;

        const totalViews = portals.reduce((sum, p) => sum + (Number(p.views) || 0), 0);
        const totalPortals = portals.length;

        // Group by category from payload
        const categories = {};
        portals.forEach(p => {
            const type = p.payload?.celebrationType || 'general';
            categories[type] = (categories[type] || 0) + 1;
        });

        console.log('\n🚀 CELEBRATION PORTAL GLOBAL STATS');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`📈 Total Global Views:   ${totalViews}`);
        console.log(`✨ Total Portals Created: ${totalPortals}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📂 Portals by Category:');
        Object.entries(categories).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
            console.log(` - ${cat.toUpperCase().padEnd(12)}: ${count}`);
        });
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    } catch (err) {
        console.error('Error fetching global stats:', err.message);
    }
}

getSiteStats();
