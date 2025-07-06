#!/usr/bin/env python3
"""
Spotify Data Extractor
Extracts top tracks and albums from Spotify API for data visualization
"""

import spotipy
from spotipy.oauth2 import SpotifyOAuth
import pandas as pd
import json
import os
from datetime import datetime
import time
from dotenv import load_dotenv

class SpotifyDataExtractor:
    def __init__(self):
        # Load environment variables
        load_dotenv()
        
        # Spotify API credentials - you'll need to set these up
        self.client_id = os.getenv('SPOTIFY_CLIENT_ID')
        self.client_secret = os.getenv('SPOTIFY_CLIENT_SECRET')
        self.redirect_uri = os.getenv('SPOTIFY_REDIRECT_URI', 'http://127.0.0.1:3000/callback')
        
        # Initialize Spotify client
        self.sp = spotipy.Spotify(auth_manager=SpotifyOAuth(
            client_id=self.client_id,
            client_secret=self.client_secret,
            redirect_uri=self.redirect_uri,
            scope='user-top-read user-read-recently-played'
        ))
    
    def get_top_tracks(self, time_range='long_term', limit=50):
        """Get user's top tracks"""
        try:
            results = self.sp.current_user_top_tracks(
                time_range=time_range,
                limit=limit
            )
            return results['items']
        except Exception as e:
            print(f"Error getting top tracks: {e}")
            return []
    
    def get_top_albums(self, time_range='long_term', limit=50):
        """Get user's top albums by analyzing top tracks"""
        tracks = self.get_top_tracks(time_range, limit)
        album_data = {}
        
        for track in tracks:
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
                    'tracks': []
                }
            
            album_data[album_id]['track_count'] += 1
            album_data[album_id]['total_popularity'] += track['popularity']
            album_data[album_id]['tracks'].append({
                'name': track['name'],
                'popularity': track['popularity'],
                'duration_ms': track['duration_ms']
            })
        
        # Convert to list and sort by total popularity
        albums_list = list(album_data.values())
        albums_list.sort(key=lambda x: x['total_popularity'], reverse=True)
        
        return albums_list[:limit]
    
    def get_recently_played(self, limit=50):
        """Get recently played tracks"""
        try:
            results = self.sp.current_user_recently_played(limit=limit)
            return results['items']
        except Exception as e:
            print(f"Error getting recently played: {e}")
            return []
    
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
    
    def generate_album_metadata(self, albums):
        """Generate metadata for 3D visualization"""
        metadata = {
            'extraction_date': datetime.now().isoformat(),
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

def main():
    print("🎵 Spotify Data Extractor")
    print("=" * 50)
    
    # Check if credentials are set
    load_dotenv()
    if not os.getenv('SPOTIFY_CLIENT_ID') or not os.getenv('SPOTIFY_CLIENT_SECRET'):
        print("❌ Please set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in your .env file")
        print("You can get these from: https://developer.spotify.com/dashboard")
        print("Make sure to use http://127.0.0.1:3000/callback as your redirect URI")
        return
    
    extractor = SpotifyDataExtractor()
    
    # Extract data
    print("📊 Extracting top albums...")
    top_albums = extractor.get_top_albums(time_range='long_term', limit=50)
    
    if not top_albums:
        print("❌ No data extracted. Please check your Spotify credentials.")
        return
    
    print(f"✅ Extracted {len(top_albums)} albums")
    
    # Save data in different formats
    print("💾 Saving data...")
    extractor.save_to_json(top_albums, 'spotify_top_albums.json')
    extractor.save_to_csv(top_albums, 'spotify_top_albums.csv')
    
    # Generate metadata for 3D visualization
    metadata = extractor.generate_album_metadata(top_albums)
    extractor.save_to_json(metadata, 'spotify_3d_metadata.json')
    
    # Display top 10 albums
    print("\n🏆 Top 10 Albums:")
    print("-" * 50)
    for i, album in enumerate(top_albums[:10]):
        print(f"{i+1:2d}. {album['name']} - {album['artist']}")
    
    print(f"\n✅ Data extraction complete! Check the ../data/ directory for output files.")

if __name__ == "__main__":
    main() 