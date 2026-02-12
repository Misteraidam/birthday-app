// Celebration Portal API Configuration
// On Vercel: API routes are at /api/* on the same domain
// Local dev: Falls back to localhost:8787 for Express server
const getApiBase = () => {
    // If VITE_API_URL is set (e.g. to /api), we need to be careful not to double up
    // if the app code appends /api. 
    // Current app code does: fetch(`${API_BASE}/api/portal`)
    // So API_BASE should NOT end in /api
    let url = import.meta.env.VITE_API_URL || (
        window.location.hostname === 'localhost'
            ? 'http://localhost:8787'
            : ''
    );

    if (url.endsWith('/api')) {
        url = url.substring(0, url.length - 4);
    }
    return url;
};

export const API_BASE = getApiBase();
