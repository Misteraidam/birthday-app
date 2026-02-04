
export default async function handler(req, res) {
    // Enable CORS for the frontend
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ error: 'Query parameter required' });
    }

    try {
        const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&limit=20&entity=song`);

        if (!response.ok) {
            throw new Error(`iTunes API error: ${response.status}`);
        }

        const data = await response.json();

        // Cache for 1 hour
        res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
        res.status(200).json(data);
    } catch (error) {
        console.error('Music search error:', error);
        res.status(500).json({ error: 'Failed to fetch music', details: error.message });
    }
}
