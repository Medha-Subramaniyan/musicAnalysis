#!/usr/bin/env python3
"""
Download Album Covers
Downloads album cover images from Spotify URLs for use in 3D visualization
"""

import json
import os
import requests
from urllib.parse import urlparse
import time

def download_album_covers():
    """Download album cover images from the extracted data"""
    
    print("🖼️  Downloading Album Covers")
    print("=" * 40)
    
    # Load the 3D metadata
    metadata_path = "../data/spotify_3d_metadata.json"
    if not os.path.exists(metadata_path):
        print("❌ 3D metadata file not found. Run spotify_data_extractor.py first.")
        return
    
    with open(metadata_path, 'r') as f:
        metadata = json.load(f)
    
    # Create albums directory
    albums_dir = "../public/albums"
    os.makedirs(albums_dir, exist_ok=True)
    
    print(f"📁 Saving to: {albums_dir}")
    print(f"🎵 Found {len(metadata['albums'])} albums to process")
    
    downloaded_count = 0
    failed_count = 0
    
    for album in metadata['albums']:
        rank = album['rank']
        artist = album['artist']
        name = album['name']
        image_url = album['image_url']
        
        # Create a safe filename
        safe_artist = "".join(c for c in artist if c.isalnum() or c in (' ', '-', '_')).rstrip()
        safe_name = "".join(c for c in name if c.isalnum() or c in (' ', '-', '_')).rstrip()
        filename = f"{rank:02d}_{safe_artist}_{safe_name}.jpg"
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
    create_album_mapping(metadata, albums_dir)
    
    return downloaded_count, failed_count

def create_album_mapping(metadata, albums_dir):
    """Create a mapping file that links album data to local image files"""
    
    mapping = []
    
    for album in metadata['albums']:
        rank = album['rank']
        artist = album['artist']
        name = album['name']
        
        # Create the same filename logic as above
        safe_artist = "".join(c for c in artist if c.isalnum() or c in (' ', '-', '_')).rstrip()
        safe_name = "".join(c for c in name if c.isalnum() or c in (' ', '-', '_')).rstrip()
        filename = f"{rank:02d}_{safe_artist}_{safe_name}.jpg"
        filename = filename.replace(' ', '_')
        
        mapping.append({
            "rank": rank,
            "artist": artist,
            "name": name,
            "local_image": f"/albums/{filename}",
            "spotify_url": album['spotify_url'],
            "spotify_image_url": album['image_url']
        })
    
    # Save mapping to JSON
    mapping_path = "../data/album_image_mapping.json"
    with open(mapping_path, 'w') as f:
        json.dump(mapping, f, indent=2)
    
    print(f"📋 Album mapping saved to: {mapping_path}")

def verify_downloads():
    """Verify that all album covers were downloaded successfully"""
    
    albums_dir = "../public/albums"
    if not os.path.exists(albums_dir):
        print("❌ Albums directory not found")
        return
    
    files = os.listdir(albums_dir)
    jpg_files = [f for f in files if f.endswith('.jpg')]
    
    print(f"\n🔍 Verification:")
    print(f"   📁 Directory: {albums_dir}")
    print(f"   🖼️  Images found: {len(jpg_files)}")
    
    if len(jpg_files) >= 40:
        print("   ✅ All album covers downloaded successfully!")
    else:
        print(f"   ⚠️  Expected 40 images, found {len(jpg_files)}")

if __name__ == "__main__":
    download_album_covers()
    verify_downloads() 