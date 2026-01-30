import requests
import json

url = "https://itunes.apple.com/lookup?id=1712959419&entity=song"
response = requests.get(url)
data = response.json()

for result in data.get('results', []):
    if result.get('wrapperType') == 'track':
        print(f"Track: {result.get('trackName')} | Artist: {result.get('artistName')} | URL: {result.get('previewUrl')}")
