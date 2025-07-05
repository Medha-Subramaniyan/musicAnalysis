#!/usr/bin/env python3
"""
Reorder Playlist Data
Reorders album data to match the original playlist sequence
"""

import json
import os
from datetime import datetime

def reorder_playlist_data():
    """Reorder ROOM playlist data to match original playlist sequence"""
    
    print("🔄 Reordering ROOM Playlist Data")
    print("=" * 40)
    
    # Load the original playlist data
    playlist_file = "../data/ROOM_playlist_albums.json"
    if not os.path.exists(playlist_file):
        print(f"❌ Playlist file not found: {playlist_file}")
        return
    
    with open(playlist_file, 'r') as f:
        albums = json.load(f)
    
    print(f"📊 Loaded {len(albums)} albums")
    
    # Create a mapping of album ID to playlist position
    # We'll use the added_at timestamp to determine order
    album_positions = {}
    
    for album in albums:
        if album['tracks']:
            # Use the first track's added_at timestamp as the position indicator
            added_at = album['tracks'][0].get('added_at', '')
            album_positions[album['id']] = added_at
    
    # Sort albums by their added_at timestamp (playlist order)
    sorted_albums = sorted(albums, key=lambda x: album_positions.get(x['id'], ''))
    
    # Update the rank field to reflect playlist order
    for i, album in enumerate(sorted_albums, 1):
        album['playlist_rank'] = i
    
    # Save the reordered data
    output_file = "../data/ROOM_playlist_albums_ordered.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(sorted_albums, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Reordered data saved to: {output_file}")
    
    # Generate new 3D metadata with correct order
    generate_ordered_3d_metadata(sorted_albums)
    
    # Generate new image mapping with correct order
    generate_ordered_image_mapping(sorted_albums)
    
    # Update CSV file
    generate_ordered_csv(sorted_albums)
    
    print("\n🎵 Albums in Playlist Order:")
    print("-" * 50)
    for i, album in enumerate(sorted_albums[:10], 1):
        track_name = album['tracks'][0]['name'] if album['tracks'] else "Unknown"
        print(f"{i:2d}. {album['name']} - {album['artist']}")
        print(f"    Track: {track_name}")
    
    if len(sorted_albums) > 10:
        print(f"    ... and {len(sorted_albums) - 10} more albums")
    
    return sorted_albums

def generate_ordered_3d_metadata(albums):
    """Generate 3D metadata with correct playlist order"""
    
    metadata = {
        'extraction_date': datetime.now().isoformat(),
        'playlist_info': {
            'name': 'ROOM',
            'total_albums': len(albums),
            'ordered_by': 'playlist_sequence'
        },
        'albums': []
    }
    
    for i, album in enumerate(albums[:40]):  # Top 40 for 3D visualization
        album_meta = {
            'rank': i + 1,
            'playlist_position': album.get('playlist_rank', i + 1),
            'id': album['id'],
            'name': album['name'],
            'artist': album['artist'],
            'release_date': album['release_date'],
            'total_tracks': album['total_tracks'],
            'album_type': album['album_type'],
            'image_url': album['images'][0]['url'] if album['images'] else '',
            'spotify_url': album['external_url'],
            'track_count': album['track_count'],
            'total_popularity': album['total_popularity'],
            'avg_popularity': album['total_popularity'] / album['track_count'] if album['track_count'] > 0 else 0,
            'track_name': album['tracks'][0]['name'] if album['tracks'] else ''
        }
        metadata['albums'].append(album_meta)
    
    # Save 3D metadata
    output_file = "../data/ROOM_playlist_3d_metadata_ordered.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(metadata, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Ordered 3D metadata saved to: {output_file}")

def generate_ordered_image_mapping(albums):
    """Generate image mapping with correct playlist order"""
    
    mapping = []
    
    for i, album in enumerate(albums[:40]):  # Top 40 for 3D visualization
        # Create filename with playlist position
        playlist_pos = album.get('playlist_rank', i + 1)
        safe_artist = "".join(c for c in album['artist'] if c.isalnum() or c in (' ', '-', '_')).rstrip()
        safe_name = "".join(c for c in album['name'] if c.isalnum() or c in (' ', '-', '_')).rstrip()
        filename = f"ROOM_{playlist_pos:02d}_{safe_artist}_{safe_name}.jpg"
        filename = filename.replace(' ', '_')
        
        mapping.append({
            "rank": i + 1,
            "playlist_position": playlist_pos,
            "artist": album['artist'],
            "name": album['name'],
            "local_image": f"/albums/{filename}",
            "spotify_url": album['external_url'],
            "spotify_image_url": album['images'][0]['url'] if album['images'] else '',
            "track_count": album['track_count'],
            "avg_popularity": album['total_popularity'] / album['track_count'] if album['track_count'] > 0 else 0,
            "track_name": album['tracks'][0]['name'] if album['tracks'] else ''
        })
    
    # Save image mapping
    output_file = "../data/ROOM_playlist_album_image_mapping_ordered.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(mapping, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Ordered image mapping saved to: {output_file}")

def generate_ordered_csv(albums):
    """Generate CSV with correct playlist order"""
    
    import pandas as pd
    
    csv_data = []
    for album in albums:
        row = {
            'playlist_position': album.get('playlist_rank', 0),
            'id': album['id'],
            'name': album['name'],
            'artist': album['artist'],
            'artist_id': album['artist_id'],
            'release_date': album['release_date'],
            'total_tracks': album['total_tracks'],
            'album_type': album['album_type'],
            'image_url': album['images'][0]['url'] if album['images'] else '',
            'external_url': album['external_url'],
            'track_count': album['track_count'],
            'total_popularity': album['total_popularity'],
            'track_names': ', '.join([t['name'] for t in album['tracks']]),
            'avg_track_popularity': sum(t['popularity'] for t in album['tracks']) / len(album['tracks']) if album['tracks'] else 0,
            'track_name': album['tracks'][0]['name'] if album['tracks'] else ''
        }
        csv_data.append(row)
    
    # Sort by playlist position
    df = pd.DataFrame(csv_data)
    df = df.sort_values('playlist_position')
    
    # Save CSV
    output_file = "../data/ROOM_playlist_albums_ordered.csv"
    df.to_csv(output_file, index=False, encoding='utf-8')
    
    print(f"✅ Ordered CSV saved to: {output_file}")

def main():
    print("🎵 ROOM Playlist Data Reordering")
    print("=" * 50)
    
    # Reorder the data
    reordered_albums = reorder_playlist_data()
    
    if reordered_albums:
        print(f"\n✅ Reordering complete!")
        print(f"📁 New files created:")
        print(f"   - ROOM_playlist_albums_ordered.json")
        print(f"   - ROOM_playlist_3d_metadata_ordered.json")
        print(f"   - ROOM_playlist_album_image_mapping_ordered.json")
        print(f"   - ROOM_playlist_albums_ordered.csv")
        print(f"\n🎯 Albums are now in the same order as your Spotify playlist!")

if __name__ == "__main__":
    main() 