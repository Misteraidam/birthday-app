import requests
import json

url = "https://itunes.apple.com/search?term=dave+tems&entity=musicTrack&limit=50"
response = requests.get(url)
data = response.json()

if data.get('resultCount', 0) == 0:
    print("No results found for 'dave tems'. Trying 'raindance'...")
    url = "https://itunes.apple.com/search?term=raindance&entity=musicTrack&limit=50"
    response = requests.get(url)
    data = response.json()

for result in data.get('results', []):
    name = f"{result.get('artistName', '')} - {result.get('trackName', '')}".lower()
    if 'dave' in name or 'tems' in name:
        print(f"Artist: {result.get('artistName')} | Track: {result.get('trackName')} | Preview: {result.get('previewUrl')}")
