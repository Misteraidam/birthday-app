require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY || process.env.VITE_SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixPortals() {
    try {
        // 1. Fetch all portals that have the "[object Object]" issue
        const { data: portals, error } = await supabase
            .from('portals')
            .select('id, payload');

        if (error) throw error;

        console.log('\n🧹 STARTING DATABASE CLEANUP...');
        let fixedCount = 0;

        for (const p of portals) {
            if (p.payload && p.payload.celebrationType === '[object Object]') {
                // Create a copy of the payload with the fixed type
                const updatedPayload = { ...p.payload, celebrationType: 'unknown' };

                // 2. Update the record back to Supabase
                const { error: updateError } = await supabase
                    .from('portals')
                    .update({ payload: updatedPayload })
                    .eq('id', p.id);

                if (updateError) {
                    console.error(`Failed to fix ID ${p.id}:`, updateError.message);
                } else {
                    console.log(`✅ Fixed portal ID: ${p.id}`);
                    fixedCount++;
                }
            }
        }

        console.log(`\n✨ CLEANUP COMPLETE: ${fixedCount} portals repaired.`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    } catch (err) {
        console.error('Cleanup Error:', err.message);
    }
}

fixPortals();
