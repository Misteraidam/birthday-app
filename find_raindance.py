import requests
import json

url = "https://itunes.apple.com/search?term=dave+raindance&entity=musicTrack&limit=10"
response = requests.get(url)
data = response.json()

for result in data.get('results', []):
    print(f"Artist: {result.get('artistName')} | Track: {result.get('trackName')} | Preview: {result.get('previewUrl')}")
