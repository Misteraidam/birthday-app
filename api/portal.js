// Vercel Serverless Function: Save/Load Portal
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
    process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_KEY || process.env.VITE_SUPABASE_KEY
);

// Async Hash Helper
function hashPasscode(passcode, salt = null) {
    return new Promise((resolve, reject) => {
        salt = salt || crypto.randomBytes(16).toString('hex');
        const iterations = 200000;
        const keylen = 32;
        const digest = 'sha256';
        crypto.pbkdf2(passcode, salt, iterations, keylen, digest, (err, derivedKey) => {
            if (err) return reject(err);
            resolve({
                salt,
                hash: derivedKey.toString('hex'),
                iterations,
                digest
            });
        });
    });
}

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // POST - Save portal
    if (req.method === 'POST') {
        try {
            const { id, data } = req.body;
            const pid = id || Math.random().toString(36).slice(2, 9);
            const payload = { ...data };

            let pass_meta = {};
            if (payload.passcode) {
                const pm = await hashPasscode(payload.passcode);
                pass_meta = { salt: pm.salt, hash: pm.hash, iterations: pm.iterations, digest: pm.digest };
                delete payload.passcode;
            }

            const row = {
                id: pid,
                payload: payload,
                pass_salt: pass_meta.salt || null,
                pass_hash: pass_meta.hash || null,
                pass_iterations: pass_meta.iterations || null,
                pass_digest: pass_meta.digest || null,
            };

            const { error } = await supabase
                .from('portals')
                .upsert(row, { onConflict: 'id' });

            if (error) throw error;

            return res.status(200).json({ id: pid });
        } catch (e) {
            console.error('PORTAL_SAVE_ERROR:', e);
            return res.status(500).json({ error: 'save_failed', details: e.message });
        }
    }

    // GET - Load portal
    if (req.method === 'GET') {
        try {
            const id = req.query.id;
            if (!id) return res.status(400).json({ error: 'missing_id' });

            const { data: rows, error } = await supabase
                .from('portals')
                .select('payload, pass_salt, pass_hash, pass_iterations, pass_digest, views')
                .eq('id', id);

            if (error) throw error;
            if (!rows || rows.length === 0) return res.status(404).json({ error: 'not_found' });

            const row = rows[0];

            // SECURITY CHECK
            if (row.pass_hash) {
                const providedPass = req.headers['x-portal-password'] || req.query.password;
                if (!providedPass) {
                    return res.json({ protected: true, id: id });
                }
                const pm = await hashPasscode(providedPass, row.pass_salt);
                if (pm.hash !== row.pass_hash) {
                    return res.status(401).json({ error: 'invalid_password' });
                }
            }

            const payload = row.payload || {};

            // Increment view count (try RPC, fallback to legacy)
            const { error: rpcError } = await supabase.rpc('increment_portal_views', { row_id: id });
            if (rpcError) {
                supabase.from('portals').update({ views: (row.views || 0) + 1 }).eq('id', id).then(() => { });
            }

            payload.passcodeHash = row.pass_hash || null;
            // payload.passSalt = row.pass_salt || null; // Don't send salt unnecessarily
            payload.stats = { views: (row.views || 0) + 1 };

            return res.status(200).json({ data: payload });
        } catch (e) {
            console.error('PORTAL_LOAD_ERROR:', e);
            return res.status(500).json({
                error: 'load_failed',
                message: e.message,
                details: e.details || e.hint || JSON.stringify(e)
            });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
