#!/usr/bin/env python3
"""
Test Spotify API Connection
Simple script to test if your Spotify credentials work
"""

import os
from dotenv import load_dotenv
import spotipy
from spotipy.oauth2 import SpotifyOAuth

def test_spotify_connection():
    """Test the Spotify API connection"""
    
    print("🎵 Testing Spotify API Connection")
    print("=" * 40)
    
    # Load environment variables from .env file
    load_dotenv()
    
    # Check if credentials are set
    client_id = os.getenv('SPOTIFY_CLIENT_ID')
    client_secret = os.getenv('SPOTIFY_CLIENT_SECRET')
    redirect_uri = os.getenv('SPOTIFY_REDIRECT_URI', 'http://127.0.0.1:8888/callback')
    
    if not client_id or not client_secret:
        print("❌ Spotify credentials not found!")
        print("\nPlease set your credentials:")
        print("1. Get your Client ID and Client Secret from:")
        print("   https://developer.spotify.com/dashboard")
        print("2. Create a .env file in this directory:")
        print("   cp env_template.txt .env")
        print("3. Edit .env and add your credentials:")
        print("   SPOTIFY_CLIENT_ID=your_client_id")
        print("   SPOTIFY_CLIENT_SECRET=your_client_secret")
        return False
    
    try:
        # Initialize Spotify client
        print("🔗 Connecting to Spotify...")
        sp = spotipy.Spotify(auth_manager=SpotifyOAuth(
            client_id=client_id,
            client_secret=client_secret,
            redirect_uri=redirect_uri,
            scope='user-top-read user-read-recently-played'
        ))
        
        # Test connection by getting user info
        print("👤 Getting user information...")
        user = sp.current_user()
        print(f"✅ Connected successfully!")
        print(f"   Name: {user['display_name']}")
        print(f"   Email: {user.get('email', 'Not provided')}")
        print(f"   Country: {user.get('country', 'Not provided')}")
        
        # Test getting top tracks
        print("\n📊 Testing top tracks retrieval...")
        top_tracks = sp.current_user_top_tracks(limit=5, time_range='short_term')
        print(f"✅ Retrieved {len(top_tracks['items'])} top tracks")
        
        print("\n🏆 Your top 5 tracks (last 4 weeks):")
        for i, track in enumerate(top_tracks['items'], 1):
            print(f"   {i}. {track['name']} - {track['artists'][0]['name']}")
        
        return True
        
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        print("\nTroubleshooting tips:")
        print("1. Make sure your Client ID and Secret are correct")
        print("2. Check that your redirect URI is set to: http://127.0.0.1:8888/callback")
        print("3. Ensure you have a Spotify Premium account (required for top tracks)")
        print("4. Make sure port 8888 is not already in use")
        print("5. Try running this script again")
        return False

if __name__ == "__main__":
    test_spotify_connection() 