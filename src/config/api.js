// Celebration Portal API Configuration
// On Vercel: API routes are at /api/* on the same domain
// Local dev: Falls back to localhost:8787 for Express server
export const API_BASE = import.meta.env.VITE_API_URL || (
    window.location.hostname === 'localhost'
        ? 'http://localhost:8787'
        : '' // Empty = same domain (Vercel)
);
