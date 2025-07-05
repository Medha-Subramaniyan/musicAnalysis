#!/usr/bin/env python3
"""
Download Playlist Album Covers
Downloads album cover images from playlist data for use in 3D visualization
"""

import json
import os
import requests
from urllib.parse import urlparse
import time
import glob

def download_playlist_album_covers(playlist_name=None):
    """Download album cover images from playlist data"""
    
    print("🖼️  Downloading Playlist Album Covers")
    print("=" * 40)
    
    # Find playlist metadata files
    if playlist_name:
        # Use specific playlist
        safe_name = "".join(c for c in playlist_name if c.isalnum() or c in (' ', '-', '_')).rstrip()
        safe_name = safe_name.replace(' ', '_')
        metadata_path = f"../data/playlist_{safe_name}_3d_metadata.json"
    else:
        # Find all playlist metadata files
        playlist_files = glob.glob("../data/playlist_*_3d_metadata.json")
        if not playlist_files:
            print("❌ No playlist metadata files found. Run playlist_data_extractor.py first.")
            return
        
        # Use the most recent file
        metadata_path = max(playlist_files, key=os.path.getctime)
        print(f"📁 Using playlist file: {os.path.basename(metadata_path)}")
    
    if not os.path.exists(metadata_path):
        print(f"❌ Playlist metadata file not found: {metadata_path}")
        print("Run playlist_data_extractor.py first to extract playlist data.")
        return
    
    with open(metadata_path, 'r') as f:
        metadata = json.load(f)
    
    # Create albums directory
    albums_dir = "../public/albums"
    os.makedirs(albums_dir, exist_ok=True)
    
    print(f"📁 Saving to: {albums_dir}")
    print(f"🎵 Found {len(metadata['albums'])} albums to process")
    print(f"📋 Playlist: {metadata['playlist_info']['name']}")
    
    downloaded_count = 0
    failed_count = 0
    
    for album in metadata['albums']:
        rank = album['rank']
        artist = album['artist']
        name = album['name']
        image_url = album['image_url']
        
        # Create a safe filename with playlist prefix
        playlist_prefix = "playlist"
        if 'playlist_info' in metadata:
            playlist_name = metadata['playlist_info']['name']
            playlist_prefix = "".join(c for c in playlist_name if c.isalnum() or c in (' ', '-', '_')).rstrip()
            playlist_prefix = playlist_prefix.replace(' ', '_')[:20]  # Limit length
        
        safe_artist = "".join(c for c in artist if c.isalnum() or c in (' ', '-', '_')).rstrip()
        safe_name = "".join(c for c in name if c.isalnum() or c in (' ', '-', '_')).rstrip()
        filename = f"{playlist_prefix}_{rank:02d}_{safe_artist}_{safe_name}.jpg"
        filename = filename.replace(' ', '_')
        
        filepath = os.path.join(albums_dir, filename)
        
        print(f"📥 [{rank:2d}] Downloading: {artist} - {name}")
        
        try:
            # Download the image
            response = requests.get(image_url, timeout=10)
            response.raise_for_status()
            
            # Save the image
            with open(filepath, 'wb') as f:
                f.write(response.content)
            
            downloaded_count += 1
            print(f"   ✅ Saved: {filename}")
            
            # Small delay to be respectful to Spotify's servers
            time.sleep(0.1)
            
        except Exception as e:
            failed_count += 1
            print(f"   ❌ Failed: {e}")
    
    print(f"\n📊 Download Summary:")
    print(f"   ✅ Successfully downloaded: {downloaded_count}")
    print(f"   ❌ Failed downloads: {failed_count}")
    print(f"   📁 Files saved to: {albums_dir}")
    
    # Create a mapping file for easy reference
    create_playlist_album_mapping(metadata, albums_dir, playlist_prefix)
    
    return downloaded_count, failed_count

def create_playlist_album_mapping(metadata, albums_dir, playlist_prefix):
    """Create a mapping file that links playlist album data to local image files"""
    
    mapping = []
    
    for album in metadata['albums']:
        rank = album['rank']
        artist = album['artist']
        name = album['name']
        
        # Create the same filename logic as above
        safe_artist = "".join(c for c in artist if c.isalnum() or c in (' ', '-', '_')).rstrip()
        safe_name = "".join(c for c in name if c.isalnum() or c in (' ', '-', '_')).rstrip()
        filename = f"{playlist_prefix}_{rank:02d}_{safe_artist}_{safe_name}.jpg"
        filename = filename.replace(' ', '_')
        
        mapping.append({
            "rank": rank,
            "artist": artist,
            "name": name,
            "local_image": f"/albums/{filename}",
            "spotify_url": album['spotify_url'],
            "spotify_image_url": album['image_url'],
            "track_count": album['track_count'],
            "avg_popularity": album['avg_popularity']
        })
    
    # Save mapping to JSON
    mapping_path = f"../data/{playlist_prefix}_album_image_mapping.json"
    with open(mapping_path, 'w') as f:
        json.dump(mapping, f, indent=2)
    
    print(f"📋 Playlist album mapping saved to: {mapping_path}")

def list_available_playlists():
    """List all available playlist metadata files"""
    
    playlist_files = glob.glob("../data/playlist_*_3d_metadata.json")
    
    if not playlist_files:
        print("❌ No playlist metadata files found.")
        print("Run playlist_data_extractor.py first to extract playlist data.")
        return []
    
    print("📋 Available playlists:")
    print("-" * 30)
    
    playlists = []
    for i, file_path in enumerate(playlist_files, 1):
        try:
            with open(file_path, 'r') as f:
                metadata = json.load(f)
                playlist_name = metadata['playlist_info']['name']
                album_count = len(metadata['albums'])
                playlists.append({
                    'name': playlist_name,
                    'file': file_path,
                    'albums': album_count
                })
                print(f"{i}. {playlist_name} ({album_count} albums)")
        except Exception as e:
            print(f"{i}. Error reading {os.path.basename(file_path)}: {e}")
    
    return playlists

def verify_playlist_downloads(playlist_name=None):
    """Verify that playlist album covers were downloaded successfully"""
    
    albums_dir = "../public/albums"
    if not os.path.exists(albums_dir):
        print("❌ Albums directory not found")
        return
    
    files = os.listdir(albums_dir)
    
    if playlist_name:
        # Check for specific playlist files
        safe_name = "".join(c for c in playlist_name if c.isalnum() or c in (' ', '-', '_')).rstrip()
        safe_name = safe_name.replace(' ', '_')
        playlist_files = [f for f in files if f.startswith(f"{safe_name}_") and f.endswith('.jpg')]
        print(f"\n🔍 Verification for '{playlist_name}':")
        print(f"   📁 Directory: {albums_dir}")
        print(f"   🖼️  Images found: {len(playlist_files)}")
    else:
        # Check for all playlist files
        playlist_files = [f for f in files if f.startswith(('playlist_', 'Playlist_')) and f.endswith('.jpg')]
        print(f"\n🔍 Verification:")
        print(f"   📁 Directory: {albums_dir}")
        print(f"   🖼️  Playlist images found: {len(playlist_files)}")
    
    if playlist_files:
        print("   ✅ Playlist album covers downloaded successfully!")
        print("   📋 Sample files:")
        for file in playlist_files[:5]:
            print(f"      - {file}")
    else:
        print("   ⚠️  No playlist album covers found")

def main():
    print("🎵 Playlist Album Cover Downloader")
    print("=" * 50)
    
    # List available playlists
    playlists = list_available_playlists()
    
    if not playlists:
        return
    
    # Ask user which playlist to process
    if len(playlists) == 1:
        playlist_name = playlists[0]['name']
        print(f"\n📥 Processing single playlist: {playlist_name}")
    else:
        print(f"\n📥 Which playlist would you like to process?")
        print("Enter playlist name or 'all' for all playlists: ", end="")
        user_input = input().strip()
        
        if user_input.lower() == 'all':
            playlist_name = None
            print("📥 Processing all playlists...")
        else:
            playlist_name = user_input
    
    # Download album covers
    if playlist_name:
        download_playlist_album_covers(playlist_name)
        verify_playlist_downloads(playlist_name)
    else:
        # Process all playlists
        for playlist in playlists:
            print(f"\n📥 Processing: {playlist['name']}")
            download_playlist_album_covers(playlist['name'])
        verify_playlist_downloads()

if __name__ == "__main__":
    main() 