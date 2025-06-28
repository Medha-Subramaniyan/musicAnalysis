#!/usr/bin/env python3
"""
Setup Environment File
Helper script to create and configure the .env file for Spotify API
"""

import os
import shutil

def setup_env_file():
    """Set up the .env file for Spotify API credentials"""
    
    print("🎵 Spotify API Environment Setup")
    print("=" * 40)
    
    # Check if .env already exists
    if os.path.exists('.env'):
        print("⚠️  .env file already exists!")
        response = input("Do you want to overwrite it? (y/N): ")
        if response.lower() != 'y':
            print("Setup cancelled.")
            return
    
    # Copy template to .env
    if os.path.exists('env_template.txt'):
        shutil.copy('env_template.txt', '.env')
        print("✅ Created .env file from template")
    else:
        print("❌ env_template.txt not found!")
        return
    
    print("\n📝 Next steps:")
    print("1. Go to https://developer.spotify.com/dashboard")
    print("2. Create a new app or use an existing one")
    print("3. Copy your Client ID and Client Secret")
    print("4. Edit the .env file and replace the placeholder values:")
    print("   SPOTIFY_CLIENT_ID=your_actual_client_id")
    print("   SPOTIFY_CLIENT_SECRET=your_actual_client_secret")
    print("\n5. Test the connection:")
    print("   python test_spotify_connection.py")
    
    # Try to open the .env file for editing
    try:
        if os.name == 'nt':  # Windows
            os.system('notepad .env')
        elif os.name == 'posix':  # macOS/Linux
            if os.system('which code') == 0:
                os.system('code .env')
            elif os.system('which nano') == 0:
                os.system('nano .env')
            elif os.system('which vim') == 0:
                os.system('vim .env')
            else:
                print(f"\n📄 Edit the .env file manually:")
                print(f"   File location: {os.path.abspath('.env')}")
    except:
        print(f"\n📄 Edit the .env file manually:")
        print(f"   File location: {os.path.abspath('.env')}")

if __name__ == "__main__":
    setup_env_file() 