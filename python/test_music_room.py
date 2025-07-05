#!/usr/bin/env python3
"""
Test Music Room Integration
Verifies that all required files are in place for the 3D music room
"""

import json
import os
import requests

def test_music_room_integration():
    """Test that all music room files are properly set up"""
    
    print("🎵 Testing Music Room Integration")
    print("=" * 40)
    
    # Check if album mapping exists
    mapping_path = "../data/album_image_mapping.json"
    if not os.path.exists(mapping_path):
        print("❌ Album mapping file not found")
        return False
    
    with open(mapping_path, 'r') as f:
        album_data = json.load(f)
    
    print(f"✅ Album mapping loaded: {len(album_data)} albums")
    
    # Check if albums directory exists
    albums_dir = "../public/albums"
    if not os.path.exists(albums_dir):
        print("❌ Albums directory not found")
        return False
    
    album_files = os.listdir(albums_dir)
    jpg_files = [f for f in album_files if f.endswith('.jpg')]
    
    print(f"✅ Album images found: {len(jpg_files)}")
    
    # Check if public data directory exists
    public_data_dir = "../../public/data"
    if not os.path.exists(public_data_dir):
        print("❌ Public data directory not found")
        return False
    
    public_mapping = os.path.join(public_data_dir, "album_image_mapping.json")
    if not os.path.exists(public_mapping):
        print("❌ Public album mapping not found")
        return False
    
    print("✅ Public data directory setup complete")
    
    # Check if public albums directory exists
    public_albums_dir = "../../public/albums"
    if not os.path.exists(public_albums_dir):
        print("❌ Public albums directory not found")
        return False
    
    public_album_files = os.listdir(public_albums_dir)
    public_jpg_files = [f for f in public_album_files if f.endswith('.jpg')]
    
    print(f"✅ Public album images: {len(public_jpg_files)}")
    
    # Verify a few sample albums
    print("\n📋 Sample Albums:")
    for i, album in enumerate(album_data[:5]):
        print(f"   {album['rank']:2d}. {album['artist']} - {album['name']}")
        print(f"       Image: {album['local_image']}")
    
    # Test web accessibility (if running locally)
    try:
        response = requests.get("http://localhost:3000/data/album_image_mapping.json", timeout=5)
        if response.status_code == 200:
            print("\n✅ Web server accessible")
        else:
            print(f"\n⚠️  Web server returned status: {response.status_code}")
    except requests.exceptions.RequestException:
        print("\n⚠️  Web server not running (start with 'npm run dev')")
    
    print(f"\n🎉 Music Room Integration Test Complete!")
    print(f"   📁 Total albums: {len(album_data)}")
    print(f"   🖼️  Images available: {len(jpg_files)}")
    print(f"   🌐 Ready for 3D visualization!")
    
    return True

if __name__ == "__main__":
    test_music_room_integration() 