require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY || process.env.VITE_SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectSample() {
    try {
        const { data: portal, error } = await supabase
            .from('portals')
            .select('payload')
            .eq('id', '2eep1n1')
            .single();

        if (error) throw error;

        console.log('\n--- SAMPLE PAYLOAD (2eep1n1) ---');
        console.log(JSON.stringify(portal.payload, null, 2));
        console.log('-------------------------------\n');

    } catch (err) {
        console.error('Error:', err.message);
    }
}

inspectSample();
