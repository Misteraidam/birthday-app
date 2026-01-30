DB integration (Neon)

What I added:
- `server/` Express API that connects to your Neon DB (uses `NEON_DATABASE_URL`).
- Endpoints: POST /api/portal (save/update), GET /api/portal?id= (load), POST /api/verify (verify passcode).
- SQL schema in `server/init.sql`.
- Frontend `src/App.jsx` will use the API when `VITE_USE_DB=true` in `.env`.

How to run locally:
1. Copy `server/.env.example` to `server/.env` and fill `NEON_DATABASE_URL`.
2. Install server deps and start:

```bash
cd server
npm install
npm run start
```

3. In the frontend, set `VITE_USE_DB=true` in your `.env` (project root) and start the dev server:

```bash
# in project root
npm run dev
```

Notes & next steps:
- Media are still saved as base64 in the portal payload. You may want to add a dedicated file storage (S3) for large files.
- PBKDF2 is used server-side; salts and iterations stored in DB. This is more secure than client-side SHA-256.
- If you want, I can now move media uploads to S3 and store only URLs in the DB.
