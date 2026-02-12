
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
// const { Pool } = require('pg'); // Removed generic Pg pool
const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

const app = express();

// --- EXPLICIT CORS CONFIGURATION ---
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true
}));

// Handle preflight requests
app.options('*', cors());

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Configure Supabase
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY || process.env.VITE_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_KEY in .env');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Helper: Hash Passcode (Async/Promise-based for better perf)
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

// SAVE PORTAL (to Supabase Table 'portals')
app.post('/api/portal', async (req, res) => {
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

    // Prepare row data
    const row = {
      id: pid,
      payload: payload,
      pass_salt: pass_meta.salt || null,
      pass_hash: pass_meta.hash || null,
      pass_iterations: pass_meta.iterations || null,
      pass_digest: pass_meta.digest || null,
      // created_at is automatic in Supabase if defined, but we can send it explicitly if needed
    };

    const { error } = await supabase
      .from('portals')
      .upsert(row, { onConflict: 'id' });

    if (error) {
      throw error;
    }

    res.json({ id: pid });
  } catch (e) {
    console.error('PORTAL_SAVE_ERROR:', e);

    // Help user if table is missing
    if (e.message.includes('relation "portals" does not exist') || e.code === '42P01') {
      return res.status(500).json({ error: 'table_missing', message: 'Please run the Setup SQL in Supabase Dashboard.' });
    }

    res.status(500).json({ error: 'save_failed', details: e.message });
  }
});

// LOAD PORTAL
app.get('/api/portal', async (req, res) => {
  try {
    const id = req.query.id;
    if (!id) return res.status(400).json({ error: 'missing_id' });

    // 1. Fetch data
    const { data: rows, error } = await supabase
      .from('portals')
      .select('payload, pass_salt, pass_hash, pass_iterations, pass_digest, views')
      .eq('id', id);

    if (error) throw error;
    if (!rows || rows.length === 0) return res.status(404).json({ error: 'not_found' });

    const row = rows[0];

    // SECURITY CHECK: If password exists
    if (row.pass_hash) {
      const providedPass = req.headers['x-portal-password'] || req.query.password;
      if (!providedPass) {
        // Return restricted info only
        return res.json({
          protected: true,
          id: id,
          hint: 'Password required'
        });
      }

      // Verify Password
      try {
        const pm = await hashPasscode(providedPass, row.pass_salt);
        if (pm.hash !== row.pass_hash) {
          return res.status(401).json({ error: 'invalid_password' });
        }
      } catch (err) {
        console.error("Password verification error:", err);
        return res.status(500).json({ error: 'auth_error' });
      }
    }

    const payload = row.payload || {};

    // 2. Increment view count using atomic RPC if available, or fallback to optimistic update
    // We try to call an RPC function 'increment_portal_views' first.
    // If that fails (e.g. function doesn't exist), we fallback to the old method but cleaner.

    // Attempt RPC first (Best for concurrency)
    const { error: rpcError } = await supabase.rpc('increment_portal_views', { row_id: id });

    if (rpcError) {
      // Fallback: Standard update (Subject to race conditions but better than nothing if RPC missing)
      // We ignore the error here to not block the main response
      supabase
        .from('portals')
        .update({ views: (row.views || 0) + 1 })
        .eq('id', id)
        .then(() => { });
    }

    // reattach passcodeHash fields (only if authorized, which we are if we get here)
    if (row.pass_hash) {
      // Only send back non-sensitive auth meta if needed, strictly NEVER the implementation details if possible
      // But for now keeping compatibility with existing frontend expectations if any
      payload.passcodeHash = row.pass_hash;
    }

    payload.stats = { views: (row.views || 0) + 1 };

    res.json({ data: payload });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'load_failed', details: e.message });
  }
});

// UPLOAD (To Supabase Storage Bucket 'portals')
app.post('/api/upload', async (req, res) => {
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
    const { data: uploadData, error } = await supabase.storage
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

    res.json({ url: urlData.publicUrl });

  } catch (e) {
    console.error('UPLOAD_ERROR_DETAILED:', e);
    const msg = e.message || 'Unknown upload error';
    if (msg.includes('Bucket not found') || msg.includes('not found')) {
      return res.status(500).json({ error: 'bucket_missing', message: 'The "portals" bucket was not found in Supabase Storage. Please create it and set it to PUBLIC.' });
    }
    res.status(500).json({ error: 'upload_failed', details: msg });
  }
});

// Validate Promo Code
app.post('/api/validate-promo', (req, res) => {
  const { code } = req.body;
  const validCodes = (process.env.PROMO_CODES || '').split(',').map(c => c.trim().toUpperCase());

  if (validCodes.includes(code?.toUpperCase())) {
    res.json({ valid: true });
  } else {
    res.status(400).json({ valid: false });
  }
});

// MUSIC SEARCH PROXY (iTunes) -- Added for local development
app.get('/api/music_search', async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ error: 'Query required' });

    console.log(`Searching iTunes for: ${query}`);
    const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&limit=20&entity=song`);

    if (!response.ok) {
      throw new Error(`iTunes API error: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (e) {
    console.error('MUSIC_SEARCH_ERROR:', e);
    res.status(500).json({ error: 'search_failed', details: e.message });
  }
});

const PORT = process.env.PORT || 8787;
app.listen(PORT, () => console.log('API listening on', PORT));
