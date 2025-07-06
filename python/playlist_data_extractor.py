#!/usr/bin/env python3
"""
Spotify Playlist Data Extractor
Extracts album data from a specific Spotify playlist for 3D visualization
"""

import spotipy
from spotipy.oauth2 import SpotifyOAuth
import pandas as pd
import json
import os
from datetime import datetime
import time
from dotenv import load_dotenv

class PlaylistDataExtractor:
    def __init__(self):
        # Load environment variables
        load_dotenv()
        
        # Spotify API credentials
        self.client_id = os.getenv('SPOTIFY_CLIENT_ID')
        self.client_secret = os.getenv('SPOTIFY_CLIENT_SECRET')
        self.redirect_uri = os.getenv('SPOTIFY_REDIRECT_URI', 'http://127.0.0.1:3000/callback')
        
        # Initialize Spotify client with playlist read scope
        self.sp = spotipy.Spotify(auth_manager=SpotifyOAuth(
            client_id=self.client_id,
            client_secret=self.client_secret,
            redirect_uri=self.redirect_uri,
            scope='playlist-read-private playlist-read-collaborative'
        ))
    
    def get_playlist_info(self, playlist_url):
        """Extract playlist ID from URL and get basic info"""
        try:
            # Extract playlist ID from URL
            if 'playlist/' in playlist_url:
                playlist_id = playlist_url.split('playlist/')[1].split('?')[0]
            else:
                playlist_id = playlist_url
            
            # Get playlist details
            playlist = self.sp.playlist(playlist_id)
            return {
                'id': playlist_id,
                'name': playlist['name'],
                'description': playlist.get('description', ''),
                'owner': playlist['owner']['display_name'],
                'total_tracks': playlist['tracks']['total'],
                'playlist_url': playlist['external_urls']['spotify']
            }
        except Exception as e:
            print(f"Error getting playlist info: {e}")
            return None
    
    def get_playlist_tracks(self, playlist_id, limit=None):
        """Get all tracks from a playlist"""
        try:
            tracks = []
            offset = 0
            batch_size = 100
            
            while True:
                results = self.sp.playlist_tracks(
                    playlist_id, 
                    offset=offset, 
                    limit=batch_size
                )
                
                if not results['items']:
                    break
                
                tracks.extend(results['items'])
                offset += batch_size
                
                # Check if we've reached the limit
                if limit and len(tracks) >= limit:
                    tracks = tracks[:limit]
                    break
                
                # Small delay to be respectful to API
                time.sleep(0.1)
            
            return tracks
        except Exception as e:
            print(f"Error getting playlist tracks: {e}")
            return []
    
    def extract_album_data_from_tracks(self, tracks):
        """Extract and aggregate album data from playlist tracks"""
        album_data = {}
        
        for item in tracks:
            track = item['track']
            if not track:  # Skip null tracks
                continue
                
            album = track['album']
            album_id = album['id']
            
            if album_id not in album_data:
                album_data[album_id] = {
                    'id': album_id,
                    'name': album['name'],
                    'artist': album['artists'][0]['name'],
                    'artist_id': album['artists'][0]['id'],
                    'release_date': album['release_date'],
                    'total_tracks': album['total_tracks'],
                    'album_type': album['album_type'],
                    'images': album['images'],
                    'external_url': album['external_urls']['spotify'],
                    'track_count': 0,
                    'total_popularity': 0,
                    'tracks': [],
                    'playlist_positions': []  # Track positions in playlist
                }
            
            album_data[album_id]['track_count'] += 1
            album_data[album_id]['total_popularity'] += track['popularity']
            album_data[album_id]['tracks'].append({
                'name': track['name'],
                'popularity': track['popularity'],
                'duration_ms': track['duration_ms'],
                'added_at': item.get('added_at', '')
            })
        
        # Convert to list and sort by track count (most represented albums first)
        albums_list = list(album_data.values())
        albums_list.sort(key=lambda x: (x['track_count'], x['total_popularity']), reverse=True)
        
        return albums_list
    
    def generate_playlist_metadata(self, playlist_info, albums):
        """Generate metadata for 3D visualization"""
        metadata = {
            'extraction_date': datetime.now().isoformat(),
            'playlist_info': playlist_info,
            'total_albums': len(albums),
            'albums': []
        }
        
        for i, album in enumerate(albums[:40]):  # Top 40 for 3D visualization
            album_meta = {
                'rank': i + 1,
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
                'avg_popularity': album['total_popularity'] / album['track_count'] if album['track_count'] > 0 else 0
            }
            metadata['albums'].append(album_meta)
        
        return metadata
    
    def save_to_json(self, data, filename):
        """Save data to JSON file"""
        os.makedirs('../data', exist_ok=True)
        filepath = f'../data/{filename}'
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"Data saved to {filepath}")
    
    def save_to_csv(self, data, filename):
        """Save data to CSV file"""
        os.makedirs('../data', exist_ok=True)
        filepath = f'../data/{filename}'
        
        if isinstance(data, list) and data:
            # Flatten the data for CSV
            flattened_data = []
            for item in data:
                if isinstance(item, dict):
                    flat_item = {}
                    for key, value in item.items():
                        if key == 'tracks':
                            flat_item['track_names'] = ', '.join([t['name'] for t in value])
                            flat_item['avg_track_popularity'] = sum(t['popularity'] for t in value) / len(value)
                        elif key == 'images':
                            flat_item['image_url'] = value[0]['url'] if value else ''
                        else:
                            flat_item[key] = value
                    flattened_data.append(flat_item)
            
            df = pd.DataFrame(flattened_data)
            df.to_csv(filepath, index=False, encoding='utf-8')
            print(f"Data saved to {filepath}")

def main():
    print("🎵 Spotify Playlist Data Extractor")
    print("=" * 50)
    
    # Check if credentials are set
    load_dotenv()
    if not os.getenv('SPOTIFY_CLIENT_ID') or not os.getenv('SPOTIFY_CLIENT_SECRET'):
        print("❌ Please set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in your .env file")
        print("You can get these from: https://developer.spotify.com/dashboard")
        print("Make sure to use http://127.0.0.1:8888/callback as your redirect URI")
        return
    
    # Get playlist URL from user
    playlist_url = input("Enter Spotify playlist URL or ID: ").strip()
    if not playlist_url:
        print("❌ No playlist URL provided")
        return
    
    extractor = PlaylistDataExtractor()
    
    # Get playlist info
    print("📋 Getting playlist information...")
    playlist_info = extractor.get_playlist_info(playlist_url)
    if not playlist_info:
        print("❌ Could not retrieve playlist information")
        return
    
    print(f"✅ Playlist: {playlist_info['name']}")
    print(f"   Owner: {playlist_info['owner']}")
    print(f"   Tracks: {playlist_info['total_tracks']}")
    
    # Extract tracks
    print("🎵 Extracting playlist tracks...")
    tracks = extractor.get_playlist_tracks(playlist_info['id'])
    
    if not tracks:
        print("❌ No tracks found in playlist")
        return
    
    print(f"✅ Extracted {len(tracks)} tracks")
    
    # Extract album data
    print("📊 Processing album data...")
    albums = extractor.extract_album_data_from_tracks(tracks)
    
    if not albums:
        print("❌ No album data extracted")
        return
    
    print(f"✅ Found {len(albums)} unique albums")
    
    # Generate safe filename from playlist name
    safe_name = "".join(c for c in playlist_info['name'] if c.isalnum() or c in (' ', '-', '_')).rstrip()
    safe_name = safe_name.replace(' ', '_')
    
    # Save data in different formats
    print("💾 Saving data...")
    extractor.save_to_json(albums, f'playlist_{safe_name}_albums.json')
    extractor.save_to_csv(albums, f'playlist_{safe_name}_albums.csv')
    
    # Generate metadata for 3D visualization
    metadata = extractor.generate_playlist_metadata(playlist_info, albums)
    extractor.save_to_json(metadata, f'playlist_{safe_name}_3d_metadata.json')
    
    # Display top albums by track count
    print(f"\n🏆 Top Albums in '{playlist_info['name']}':")
    print("-" * 50)
    for i, album in enumerate(albums[:10]):
        print(f"{i+1:2d}. {album['name']} - {album['artist']} ({album['track_count']} tracks)")
    
    print(f"\n✅ Playlist extraction complete!")
    print(f"📁 Check the ../data/ directory for output files:")
    print(f"   - playlist_{safe_name}_albums.json")
    print(f"   - playlist_{safe_name}_albums.csv")
    print(f"   - playlist_{safe_name}_3d_metadata.json")

if __name__ == "__main__":
    main() 