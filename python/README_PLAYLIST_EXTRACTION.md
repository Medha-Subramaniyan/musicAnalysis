# 🎵 Spotify Playlist Data Extraction

This directory contains scripts to extract album data from specific Spotify playlists for use in your 3D music room visualization.

## 📋 Prerequisites

1. **Spotify API Credentials**: Make sure your `.env` file contains:
   ```
   SPOTIFY_CLIENT_ID=your_client_id_here
   SPOTIFY_CLIENT_SECRET=your_client_secret_here
   SPOTIFY_REDIRECT_URI=http://127.0.0.1:3000/callback
   ```

2. **Python Dependencies**: Install required packages:
   ```bash
   pip install spotipy pandas python-dotenv requests
   ```

## 🚀 Quick Start

### Step 1: Test Your Connection
First, verify that your Spotify API credentials are working:

```bash
python test_playlist_connection.py
```

This will:
- ✅ Test your API credentials
- ✅ Verify playlist access permissions
- ✅ Show your available playlists

### Step 2: Extract Playlist Data
Run the playlist data extractor:

```bash
python playlist_data_extractor.py
```

When prompted, enter a Spotify playlist URL. For example:
- Full URL: `https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M`
- Or just the ID: `37i9dQZF1DXcBWIGoYBM5M`

### Step 3: Download Album Covers
Download the album cover images:

```bash
python download_playlist_album_covers.py
```

This will:
- 📥 Download album cover images
- 📋 Create mapping files for your 3D visualization
- ✅ Verify all downloads completed successfully

## 📁 Output Files

After running the extraction, you'll find these files in the `../data/` directory:

### For a playlist named "My Favorite Songs":
- `playlist_My_Favorite_Songs_albums.json` - Detailed album data
- `playlist_My_Favorite_Songs_albums.csv` - Tabular format
- `playlist_My_Favorite_Songs_3d_metadata.json` - Optimized for 3D visualization
- `My_Favorite_Songs_album_image_mapping.json` - Image file mappings

### Album Cover Images:
- Downloaded to `../public/albums/`
- Named with playlist prefix: `My_Favorite_Songs_01_Artist_Album.jpg`

## 🎯 Features

### Playlist Data Extractor (`playlist_data_extractor.py`)
- 🔍 Extracts playlist information (name, owner, track count)
- 🎵 Retrieves all tracks from the playlist
- 📊 Aggregates album data (most represented albums first)
- 💾 Saves data in multiple formats (JSON, CSV)
- 🎨 Generates 3D visualization metadata

### Album Cover Downloader (`download_playlist_album_covers.py`)
- 🖼️ Downloads high-quality album cover images
- 📋 Creates mapping files for easy reference
- 🔄 Supports multiple playlists
- ✅ Verifies download success
- 🎯 Organizes files with playlist prefixes

### Connection Tester (`test_playlist_connection.py`)
- 🔗 Tests Spotify API connectivity
- 📋 Verifies playlist access permissions
- 👤 Shows your available playlists
- ✅ Validates credentials before extraction

## 🔧 Usage Examples

### Extract from a Public Playlist
```bash
python playlist_data_extractor.py
# Enter: https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M
```

### Extract from Your Own Playlist
```bash
python playlist_data_extractor.py
# Enter: https://open.spotify.com/playlist/your_playlist_id
```

### Download Covers for Specific Playlist
```bash
python download_playlist_album_covers.py
# Enter playlist name when prompted
```

### Download Covers for All Playlists
```bash
python download_playlist_album_covers.py
# Enter: all
```

## 📊 Data Structure

### Album Data Format
```json
{
  "rank": 1,
  "id": "album_spotify_id",
  "name": "Album Name",
  "artist": "Artist Name",
  "release_date": "2023-01-01",
  "total_tracks": 12,
  "album_type": "album",
  "image_url": "https://i.scdn.co/image/...",
  "spotify_url": "https://open.spotify.com/album/...",
  "track_count": 3,
  "total_popularity": 180,
  "avg_popularity": 60.0
}
```

### Playlist Metadata Format
```json
{
  "extraction_date": "2024-01-01T12:00:00",
  "playlist_info": {
    "id": "playlist_id",
    "name": "Playlist Name",
    "owner": "Owner Name",
    "total_tracks": 50
  },
  "total_albums": 25,
  "albums": [...]
}
```

## 🔗 Integration with 3D Music Room

The extracted data is designed to work seamlessly with your existing 3D music room:

1. **Copy data files** to your website's public directory
2. **Update your MusicRoom component** to load playlist data
3. **Use the album mapping** to display real album covers
4. **Leverage track counts** for album sizing/positioning

## 🛠️ Troubleshooting

### Common Issues

**"Authentication failed"**
- Check your `.env` file has correct credentials
- Verify redirect URI matches Spotify app settings

**"Playlist not found"**
- Ensure playlist is public or you have access
- Check playlist URL/ID is correct

**"No tracks found"**
- Playlist might be empty
- Check playlist privacy settings

**"Download failed"**
- Network connectivity issues
- Spotify image URLs might be temporarily unavailable

### Debug Steps
1. Run `test_playlist_connection.py` first
2. Check your `.env` file format
3. Verify playlist URL is accessible
4. Check network connectivity

## 🎨 Customization

### Modify Album Limit
In `playlist_data_extractor.py`, change:
```python
for i, album in enumerate(albums[:40]):  # Change 40 to your desired limit
```

### Change Image Quality
In `download_playlist_album_covers.py`, modify the image URL to get different sizes:
- `640x640`: `album['images'][0]['url']`
- `300x300`: `album['images'][1]['url']`
- `64x64`: `album['images'][2]['url']`

### Add Custom Fields
Extend the album metadata structure in `generate_playlist_metadata()` to include additional fields like genres, release year, etc.

## 📈 Next Steps

After extracting playlist data:

1. **Integrate with your 3D music room**
2. **Add playlist switching functionality**
3. **Implement recommendation system**
4. **Create playlist comparison features**
5. **Add social sharing capabilities**

---

🎵 **Happy playlist extracting!** Your 3D music room is about to get a lot more personal and dynamic. 