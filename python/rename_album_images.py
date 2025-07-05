#!/usr/bin/env python3
"""
Rename Album Images
Renames album image files to match the playlist order
"""

import json
import os
import shutil

def rename_album_images():
    """Rename album images to match playlist order"""
    
    print("🔄 Renaming Album Images to Match Playlist Order")
    print("=" * 50)
    
    # Load the ordered image mapping
    mapping_file = "../data/ROOM_playlist_album_image_mapping_ordered.json"
    if not os.path.exists(mapping_file):
        print(f"❌ Ordered mapping file not found: {mapping_file}")
        return
    
    with open(mapping_file, 'r') as f:
        mapping = json.load(f)
    
    albums_dir = "../public/albums"
    if not os.path.exists(albums_dir):
        print(f"❌ Albums directory not found: {albums_dir}")
        return
    
    print(f"📁 Working directory: {albums_dir}")
    print(f"🎵 Found {len(mapping)} albums to rename")
    
    # Create a backup directory
    backup_dir = "../public/albums_backup"
    os.makedirs(backup_dir, exist_ok=True)
    
    # First, backup all existing ROOM images
    print("💾 Creating backup of existing images...")
    for file in os.listdir(albums_dir):
        if file.startswith('ROOM_') and file.endswith('.jpg'):
            src = os.path.join(albums_dir, file)
            dst = os.path.join(backup_dir, file)
            shutil.copy2(src, dst)
    
    print(f"✅ Backup created in: {backup_dir}")
    
    # Create a mapping from old filenames to new filenames
    old_to_new = {}
    
    for album in mapping:
        old_filename = None
        new_filename = None
        
        # Find the old filename by matching artist and album name
        artist = album['artist']
        name = album['name']
        
        # Create safe versions for filename matching
        safe_artist = "".join(c for c in artist if c.isalnum() or c in (' ', '-', '_')).rstrip()
        safe_name = "".join(c for c in name if c.isalnum() or c in (' ', '-', '_')).rstrip()
        safe_artist = safe_artist.replace(' ', '_')
        safe_name = safe_name.replace(' ', '_')
        
        # Look for the old file
        for file in os.listdir(albums_dir):
            if file.startswith('ROOM_') and file.endswith('.jpg'):
                if safe_artist in file and safe_name in file:
                    old_filename = file
                    break
        
        if old_filename:
            # Create new filename with playlist position
            playlist_pos = album['playlist_position']
            new_filename = f"ROOM_{playlist_pos:02d}_{safe_artist}_{safe_name}.jpg"
            
            old_to_new[old_filename] = new_filename
            print(f"📝 {old_filename} → {new_filename}")
        else:
            print(f"⚠️  Could not find file for: {artist} - {name}")
    
    # Rename the files
    print(f"\n🔄 Renaming {len(old_to_new)} files...")
    renamed_count = 0
    
    for old_name, new_name in old_to_new.items():
        old_path = os.path.join(albums_dir, old_name)
        new_path = os.path.join(albums_dir, new_name)
        
        try:
            os.rename(old_path, new_path)
            renamed_count += 1
            print(f"✅ {old_name} → {new_name}")
        except Exception as e:
            print(f"❌ Failed to rename {old_name}: {e}")
    
    print(f"\n📊 Renaming Summary:")
    print(f"   ✅ Successfully renamed: {renamed_count}")
    print(f"   📁 Backup available in: {backup_dir}")
    print(f"   🎵 Album images now match playlist order!")
    
    # Verify the new order
    print(f"\n🎵 New Album Order (first 10):")
    print("-" * 40)
    for album in mapping[:10]:
        playlist_pos = album['playlist_position']
        artist = album['artist']
        name = album['name']
        track_name = album['track_name']
        print(f"{playlist_pos:2d}. {name} - {artist}")
        print(f"    Track: {track_name}")
    
    return renamed_count

def main():
    print("🎵 Album Image Renaming")
    print("=" * 50)
    
    # Rename the images
    renamed_count = rename_album_images()
    
    if renamed_count > 0:
        print(f"\n🎉 Renaming complete!")
        print(f"📁 {renamed_count} album images renamed to match playlist order")
        print(f"💾 Original files backed up in ../public/albums_backup/")
        print(f"\n🎯 Your album images now reflect the exact order of your ROOM playlist!")

if __name__ == "__main__":
    main() 