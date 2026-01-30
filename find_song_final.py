import requests
import json

url = "https://itunes.apple.com/search?term=raindance&limit=200"
response = requests.get(url)
data = response.json()

matches = []
for r in data.get('results', []):
    artist = r.get('artistName', '').lower()
    track = r.get('trackName', '').lower()
    if 'dave' in artist or 'tems' in artist:
        matches.append({
            'artist': r.get('artistName'),
            'track': r.get('trackName'),
            'url': r.get('previewUrl')
        })

print(json.dumps(matches, indent=2))
