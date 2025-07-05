import os
import json
import difflib

# Paths
ALBUMS_DIR = os.path.join('public', 'albums')
JSON_PATH = os.path.join('data', 'ROOM_playlist_album_image_mapping_with_metadata.json')
OUTPUT_PATH = os.path.join('data', 'ROOM_playlist_album_image_mapping_with_metadata_fixed.json')

# Load album image files
album_files = [f for f in os.listdir(ALBUMS_DIR) if f.lower().endswith('.jpg')]

# Load JSON
with open(JSON_PATH, 'r') as f:
    albums_json = json.load(f)

# Helper to create a search key from album/artist name

def make_key(album):
    # Lowercase, remove spaces and special chars for fuzzy matching
    return (album['artist'] + ' ' + album['name']).lower().replace(' ', '').replace("'", '').replace('_', '').replace('-', '')

def make_file_key(filename):
    # Remove extension, lowercase, remove spaces and special chars
    return os.path.splitext(filename)[0].lower().replace(' ', '').replace("'", '').replace('_', '').replace('-', '')

# Build a lookup for files
file_keys = {make_file_key(f): f for f in album_files}

# Update JSON
num_matched = 0
for album in albums_json:
    key = make_key(album)
    # Find best match
    best_match = difflib.get_close_matches(key, file_keys.keys(), n=1, cutoff=0.6)
    if best_match:
        matched_file = file_keys[best_match[0]]
        album['local_image'] = f"/albums/{matched_file}"
        num_matched += 1
    else:
        print(f"No match for: {album['artist']} - {album['name']}")

# Save updated JSON
with open(OUTPUT_PATH, 'w') as f:
    json.dump(albums_json, f, indent=2)

print(f"Updated {num_matched} album image paths. Output written to {OUTPUT_PATH}") 