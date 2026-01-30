
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
// const { Pool } = require('pg'); // Removed generic Pg pool
const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Configure Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_KEY in .env');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Helper: Hash Passcode
function hashPasscodeSync(passcode, salt = null) {
  salt = salt || crypto.randomBytes(16).toString('hex');
  const iterations = 200000;
  const keylen = 32;
  const digest = 'sha256';
  const hash = crypto.pbkdf2Sync(passcode, salt, iterations, keylen, digest).toString('hex');
  return { salt, hash, iterations, digest };
}

// SAVE PORTAL (to Supabase Table 'portals')
app.post('/api/portal', async (req, res) => {
  try {
    const { id, data } = req.body;
    const pid = id || Math.random().toString(36).slice(2, 9);
    const payload = { ...data };

    let pass_meta = {};
    if (payload.passcode) {
      const pm = hashPasscodeSync(payload.passcode);
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
    const payload = row.payload || {};

    // 2. Increment view count (async, don't block response)
    supabase
      .from('portals')
      .update({ views: (row.views || 0) + 1 })
      .eq('id', id)
      .then(({ error }) => { if (error) console.error("Update views failed:", error); });

    // reattach passcodeHash fields
    payload.passcodeHash = row.pass_hash || null;
    payload.passSalt = row.pass_salt || null;
    payload.passIterations = row.pass_iterations || null;
    payload.passDigest = row.pass_digest || null;
    payload.stats = { views: (row.views || 0) + 1 };

    res.json({ data: payload });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'load_failed' });
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
    console.error('UPLOAD ERROR:', e);
    if (e.message && e.message.includes('Bucket not found')) {
      return res.status(500).json({ error: 'bucket_missing', message: 'Please create "portals" bucket in Supabase.' });
    }
    res.status(500).json({ error: 'upload_failed', details: e.message });
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

const PORT = process.env.PORT || 8787;
app.listen(PORT, () => console.log('API listening on', PORT));
