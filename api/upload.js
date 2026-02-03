// Vercel Serverless Function: Upload to Supabase Storage
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '50mb',
        },
    },
};

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { filename, data } = req.body;
        if (!data) return res.status(400).json({ error: 'missing_data' });

        // Parse base64
        const matches = data.match(/^data:(.+);base64,(.+)$/);
        let contentType = 'application/octet-stream';
        let buffer;
        if (matches) {
            contentType = matches[1];
            buffer = Buffer.from(matches[2], 'base64');
        } else {
            buffer = Buffer.from(data, 'base64');
        }

        const uniqueFilename = `${Date.now()}-${filename || 'upload.bin'}`;

        // Upload to 'portals' bucket
        const { error } = await supabase.storage
            .from('portals')
            .upload(uniqueFilename, buffer, {
                contentType: contentType,
                upsert: false
            });

        if (error) throw error;

        // Get Public URL
        const { data: urlData } = supabase.storage
            .from('portals')
            .getPublicUrl(uniqueFilename);

        return res.status(200).json({ url: urlData.publicUrl });

    } catch (e) {
        console.error('UPLOAD_ERROR:', e);
        return res.status(500).json({ error: 'upload_failed', details: e.message });
    }
}
