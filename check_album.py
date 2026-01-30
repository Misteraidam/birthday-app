import requests
import json

url = "https://itunes.apple.com/search?term=the+boy+who+played+the+harp+dave&entity=musicTrack&limit=20"
response = requests.get(url)
data = response.json()

for result in data.get('results', []):
    print(f"Track: {result.get('trackName')} | Artist: {result.get('artistName')} | URL: {result.get('previewUrl')}")
