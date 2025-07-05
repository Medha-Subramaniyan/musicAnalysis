#!/usr/bin/env python3
"""
Test Playlist Connection
Verifies Spotify API connection and playlist access
"""

import spotipy
from spotipy.oauth2 import SpotifyOAuth
import os
from dotenv import load_dotenv

def test_spotify_connection():
    """Test basic Spotify API connection"""
    
    print("🔗 Testing Spotify API Connection")
    print("=" * 40)
    
    # Load environment variables
    load_dotenv()
    
    # Check if credentials are set
    client_id = os.getenv('SPOTIFY_CLIENT_ID')
    client_secret = os.getenv('SPOTIFY_CLIENT_SECRET')
    
    if not client_id or not client_secret:
        print("❌ Missing Spotify credentials in .env file")
        print("Please set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET")
        return False
    
    print("✅ Environment variables loaded")
    print(f"   Client ID: {client_id[:8]}...")
    print(f"   Client Secret: {client_secret[:8]}...")
    
    try:
        # Initialize Spotify client
        sp = spotipy.Spotify(auth_manager=SpotifyOAuth(
            client_id=client_id,
            client_secret=client_secret,
            redirect_uri='http://127.0.0.1:8888/callback',
            scope='playlist-read-private playlist-read-collaborative'
        ))
        
        # Test API connection
        print("\n🔍 Testing API connection...")
        user = sp.current_user()
        print(f"✅ Connected as: {user['display_name']}")
        print(f"   User ID: {user['id']}")
        print(f"   Email: {user.get('email', 'Not provided')}")
        
        return True
        
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        return False

def test_playlist_access():
    """Test playlist access with a sample playlist"""
    
    print("\n📋 Testing Playlist Access")
    print("=" * 40)
    
    load_dotenv()
    
    try:
        sp = spotipy.Spotify(auth_manager=SpotifyOAuth(
            client_id=os.getenv('SPOTIFY_CLIENT_ID'),
            client_secret=os.getenv('SPOTIFY_CLIENT_SECRET'),
            redirect_uri='http://127.0.0.1:8888/callback',
            scope='playlist-read-private playlist-read-collaborative'
        ))
        
        # Test with a public playlist (Spotify's "Today's Top Hits")
        test_playlist_id = "37i9dQZF1DXcBWIGoYBM5M"
        
        print(f"🔍 Testing access to playlist: {test_playlist_id}")
        
        playlist = sp.playlist(test_playlist_id)
        print(f"✅ Successfully accessed playlist: {playlist['name']}")
        print(f"   Owner: {playlist['owner']['display_name']}")
        print(f"   Tracks: {playlist['tracks']['total']}")
        print(f"   Public: {playlist['public']}")
        
        # Test getting tracks
        tracks = sp.playlist_tracks(test_playlist_id, limit=5)
        print(f"✅ Successfully retrieved {len(tracks['items'])} sample tracks")
        
        return True
        
    except Exception as e:
        print(f"❌ Playlist access failed: {e}")
        return False

def test_user_playlists():
    """Test access to user's own playlists"""
    
    print("\n👤 Testing User Playlist Access")
    print("=" * 40)
    
    load_dotenv()
    
    try:
        sp = spotipy.Spotify(auth_manager=SpotifyOAuth(
            client_id=os.getenv('SPOTIFY_CLIENT_ID'),
            client_secret=os.getenv('SPOTIFY_CLIENT_SECRET'),
            redirect_uri='http://127.0.0.1:8888/callback',
            scope='playlist-read-private playlist-read-collaborative'
        ))
        
        # Get user's playlists
        playlists = sp.current_user_playlists(limit=10)
        
        if playlists['items']:
            print(f"✅ Found {len(playlists['items'])} playlists")
            print("\n📋 Your playlists:")
            for i, playlist in enumerate(playlists['items'], 1):
                print(f"   {i}. {playlist['name']} ({playlist['tracks']['total']} tracks)")
                print(f"      ID: {playlist['id']}")
                print(f"      URL: {playlist['external_urls']['spotify']}")
                print()
        else:
            print("⚠️  No playlists found")
        
        return True
        
    except Exception as e:
        print(f"❌ User playlist access failed: {e}")
        return False

def main():
    print("🎵 Spotify Playlist Connection Test")
    print("=" * 50)
    
    # Test basic connection
    if not test_spotify_connection():
        print("\n❌ Basic connection failed. Please check your credentials.")
        return
    
    # Test playlist access
    if not test_playlist_access():
        print("\n❌ Playlist access failed. Please check your permissions.")
        return
    
    # Test user playlists
    if not test_user_playlists():
        print("\n❌ User playlist access failed.")
        return
    
    print("\n🎉 All tests passed!")
    print("✅ You're ready to extract playlist data")
    print("\nNext steps:")
    print("1. Run: python playlist_data_extractor.py")
    print("2. Enter a playlist URL when prompted")
    print("3. Run: python download_playlist_album_covers.py")

if __name__ == "__main__":
    main() 