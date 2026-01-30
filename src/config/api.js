// Celebration Portal API Configuration
export const API_BASE = (import.meta.env.VITE_API_URL || '').trim().replace(/\/+$/, '') || (
    window.location.hostname === 'localhost'
        ? 'http://localhost:8787'
        : (window.location.protocol === 'https:' ? 'https://' : 'http://') + window.location.hostname + (window.location.port ? `:${window.location.port}` : '')
);
