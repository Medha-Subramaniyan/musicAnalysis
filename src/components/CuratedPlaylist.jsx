import React, { useMemo, useEffect, useState } from "react";
import albumData from "../../data/ROOM_playlist_album_image_mapping_with_metadata_fixed.json";

const CLIENT_ID = '2431fa0ab44c44c9bd519c9178055f5d';
const CLIENT_SECRET = '3448c198ba8f4d8ba84c3fe6564aee6c';
const REDIRECT_URI = 'http://127.0.0.1:3000/callback';
const SCOPES = [
  'playlist-modify-private',
  'playlist-modify-public',
  'user-read-private',
  'user-read-email',
  'user-library-read'
];

// PKCE helper functions
function generateRandomString(length) {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}

async function sha256(plain) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest('SHA-256', data);
}

function base64encode(input) {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

export default function CuratedPlaylist({ selectedGenres, selectedMoods, onBack }) {
  // Filter albums by selected genres/moods with fallback strategy
  const matchingAlbums = useMemo(() => {
    // First try: exact match (both genres AND moods)
    let albums = albumData.filter(album =>
      album.genres.some(g => selectedGenres.includes(g)) &&
      album.moods.some(m => selectedMoods.includes(m))
    );
    
    // If we don't have enough albums, try genre-only match
    if (albums.length < 5) {
      const genreAlbums = albumData.filter(album =>
        album.genres.some(g => selectedGenres.includes(g))
      );
      // Add genre matches that aren't already included
      genreAlbums.forEach(album => {
        if (!albums.find(a => a.rank === album.rank)) {
          albums.push(album);
        }
      });
    }
    
    // If we still don't have enough, try mood-only match
    if (albums.length < 5) {
      const moodAlbums = albumData.filter(album =>
        album.moods.some(m => selectedMoods.includes(m))
      );
      // Add mood matches that aren't already included
      moodAlbums.forEach(album => {
        if (!albums.find(a => a.rank === album.rank)) {
          albums.push(album);
        }
      });
    }
    
    // If we still don't have enough, add some popular albums as fallback
    if (albums.length < 5) {
      const popularAlbums = albumData.slice(0, 10); // Top 10 albums
      popularAlbums.forEach(album => {
        if (!albums.find(a => a.rank === album.rank)) {
          albums.push(album);
        }
      });
    }
    
    return albums;
  }, [selectedGenres, selectedMoods]);

  // Collect songs from matching albums (limit to 1-2 per album for variety, interleaved)
  const playlist = useMemo(() => {
    // Step 1: Build a list of lists (tracks per album)
    const tracksByAlbum = matchingAlbums.map(album => {
      if (album.top_tracks && album.top_tracks.length > 0) {
        return album.top_tracks.slice(0, 4).map(track => ({
          name: track,
          albumName: album.name,
          albumArtist: album.artist,
          albumImage: album.local_image,
          albumSpotify: album.spotify_url,
        }));
      }
      return [];
    }).filter(arr => arr.length > 0);

    // Step 2: Interleave tracks (round-robin)
    const interleaved = [];
    let added = 0;
    let round = 0;
    const maxSongs = 20;
    const minSongs = 5;
    while (added < maxSongs) {
      let anyAddedThisRound = false;
      for (let i = 0; i < tracksByAlbum.length; i++) {
        if (tracksByAlbum[i][round]) {
          interleaved.push(tracksByAlbum[i][round]);
          added++;
          anyAddedThisRound = true;
          if (added >= maxSongs) break;
        }
      }
      if (!anyAddedThisRound) break; // No more tracks to add
      round++;
    }
    // Ensure at least minSongs
    if (interleaved.length < minSongs) {
      // Add more tracks from the same albums if needed
      for (let i = 0; i < tracksByAlbum.length && interleaved.length < minSongs; i++) {
        for (let j = round; j < tracksByAlbum[i].length && interleaved.length < minSongs; j++) {
          interleaved.push(tracksByAlbum[i][j]);
        }
      }
    }
    // Debug logging
    console.log('Matching albums:', matchingAlbums.length);
    console.log('Generated playlist:', interleaved.length, 'songs');
    if (interleaved.length > 0) {
      console.log('Sample track:', interleaved[0]);
      console.log('Sample image path:', interleaved[0].albumImage);
    }
    return interleaved;
  }, [matchingAlbums]);

  // Generate explanation
  const explanation = useMemo(() => {
    return (
      <>
        <span className="font-semibold text-amber-900">Why these songs?</span> <br />
        Based on your favorite genres ({selectedGenres.join(", ")}) and your vibe ({selectedMoods.join(", ")}), I've curated the following playlist for you based on my taste. <br />
        <span className="text-amber-700">I hope you find something you enjoy!</span>
      </>
    );
  }, [selectedGenres, selectedMoods]);

  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('spotify_access_token'));
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);

  // Check authentication status when component mounts
  useEffect(() => {
    const token = localStorage.getItem('spotify_access_token');
    setIsAuthenticated(!!token);
  }, []);

  const loginWithSpotify = async () => {
    try {
      // Generate PKCE parameters
      const codeVerifier = generateRandomString(64);
      const hashed = await sha256(codeVerifier);
      const codeChallenge = base64encode(hashed);
      
      // Store code verifier for later use
      localStorage.setItem('spotify_code_verifier', codeVerifier);
      
      const authUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPES.join(' '))}&code_challenge_method=S256&code_challenge=${codeChallenge}&show_dialog=true`;
      
      console.log('Redirect URI being used:', REDIRECT_URI);
      console.log('Full auth URL:', authUrl);
      console.log('Code verifier stored for PKCE');
      
      window.location.href = authUrl;
    } catch (error) {
      console.error('Error generating PKCE parameters:', error);
      alert('Error starting authentication. Please try again.');
    }
  };

  // Handler to create playlist on Spotify
  const handleCreateSpotifyPlaylist = async () => {
    const accessToken = localStorage.getItem('spotify_access_token');
    if (!accessToken) {
      alert('Please log in with Spotify first!');
      return;
    }

    const playlistName = "Curated Soundscape";
    
    try {
      setIsCreatingPlaylist(true);
      console.log('Starting playlist creation with', playlist.length, 'tracks');
      
      // 1. Get user ID
      const userRes = await fetch('https://api.spotify.com/v1/me', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      
      if (!userRes.ok) {
        throw new Error('Failed to get user info');
      }
      
      const userData = await userRes.json();
      console.log('User data retrieved:', userData.display_name);

      // 2. Search for tracks and get their URIs
      const searchPromises = playlist.map(async (track, index) => {
        try {
          console.log(`Processing track ${index + 1}/${playlist.length}: ${track.name} by ${track.albumArtist} from ${track.albumName}`);
          
          // First, try to get the track directly from the specific album
          if (track.albumSpotify) {
            try {
              // Extract album ID from Spotify URL
              const albumIdMatch = track.albumSpotify.match(/album\/([a-zA-Z0-9]+)/);
              if (albumIdMatch) {
                const albumId = albumIdMatch[1];
                console.log(`  -> Searching in album: ${track.albumName} (${albumId})`);
                
                // Get tracks from the specific album
                const albumTracksRes = await fetch(`https://api.spotify.com/v1/albums/${albumId}/tracks`, {
                  headers: { Authorization: `Bearer ${accessToken}` }
                });
                
                if (albumTracksRes.ok) {
                  const albumTracksData = await albumTracksRes.json();
                  
                  // Find the specific track in the album
                  const matchingTrack = albumTracksData.items.find(albumTrack => {
                    const trackNameMatch = albumTrack.name.toLowerCase().includes(track.name.toLowerCase()) ||
                                          track.name.toLowerCase().includes(albumTrack.name.toLowerCase());
                    return trackNameMatch;
                  });
                  
                  if (matchingTrack) {
                    console.log(`  ✅ Found in album: ${matchingTrack.name} - ${matchingTrack.uri}`);
                    return matchingTrack.uri;
                  } else {
                    console.log(`  ⚠️ Track not found in album, trying general search...`);
                  }
                } else {
                  console.log(`  ⚠️ Album not accessible, trying general search...`);
                }
              }
            } catch (albumError) {
              console.log(`  ⚠️ Album search failed, trying general search...`, albumError);
            }
          }
          
          // Fallback: General search with album name included for better accuracy
          const searchQuery = `track:"${track.name}" artist:"${track.albumArtist}" album:"${track.albumName}"`;
          const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchQuery)}&type=track&limit=5`;
          
          console.log(`  -> General search: ${searchQuery}`);
          
          const searchRes = await fetch(searchUrl, {
            headers: { Authorization: `Bearer ${accessToken}` }
          });
          
          if (!searchRes.ok) {
            console.warn(`  ❌ Search failed for: ${track.name}`);
            return null;
          }
          
          const searchData = await searchRes.json();
          
          if (searchData.tracks && searchData.tracks.items.length > 0) {
            // Prefer tracks from the correct album if available
            let foundTrack = searchData.tracks.items.find(item => 
              item.album.name.toLowerCase().includes(track.albumName.toLowerCase()) ||
              track.albumName.toLowerCase().includes(item.album.name.toLowerCase())
            );
            
            // If no album match, take the first result
            if (!foundTrack) {
              foundTrack = searchData.tracks.items[0];
            }
            
            console.log(`  ✅ Found via search: ${foundTrack.name} by ${foundTrack.artists[0].name} from ${foundTrack.album.name} - ${foundTrack.uri}`);
            return foundTrack.uri;
          } else {
            console.warn(`  ❌ No results found for: ${track.name} by ${track.albumArtist}`);
            return null;
          }
        } catch (error) {
          console.error(`  ❌ Error processing track: ${track.name}`, error);
          return null;
        }
      });

      // Wait for all searches to complete
      const searchResults = await Promise.all(searchPromises);
      const validTrackUris = searchResults.filter(uri => uri !== null);
      
      console.log(`Found ${validTrackUris.length} out of ${playlist.length} tracks`);
      
      if (validTrackUris.length === 0) {
        throw new Error('No tracks could be found on Spotify. Please try again.');
      }

      // 3. Create playlist
      const createRes = await fetch(`https://api.spotify.com/v1/users/${userData.id}/playlists`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: playlistName,
          description: "Curated by Medha, for you :)",
          public: false
        })
      });
      
      if (!createRes.ok) {
        throw new Error('Failed to create playlist');
      }
      
      const playlistData = await createRes.json();
      console.log('Playlist created:', playlistData.name);

      // 4. Add tracks to playlist
      if (validTrackUris.length > 0) {
        const addTracksRes = await fetch(`https://api.spotify.com/v1/playlists/${playlistData.id}/tracks`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ uris: validTrackUris })
        });
        
        if (!addTracksRes.ok) {
          throw new Error('Failed to add tracks to playlist');
        }
        
        console.log(`Added ${validTrackUris.length} tracks to playlist`);
      }

      // Success!
      alert(`Playlist created successfully with ${validTrackUris.length} tracks!`);
      window.open(playlistData.external_urls.spotify, '_blank');
      
    } catch (err) {
      console.error('Playlist creation error:', err);
      alert('Failed to create playlist: ' + err.message);
    } finally {
      setIsCreatingPlaylist(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 min-h-screen">
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-end items-center">
          <button onClick={onBack} className="text-amber-700 hover:text-amber-900 font-medium">← Back</button>
        </div>
      </header>

      <main className="pt-28 max-w-3xl mx-auto px-4">
        <h2 className="serif text-3xl md:text-4xl font-semibold text-amber-900 mb-4 italic text-center">
          Your Curated Soundscape
        </h2>
        <div className="bg-white/70 rounded-xl p-6 mb-8 shadow vinyl-shadow text-center">
          {explanation}
        </div>
        <div className="space-y-6">
          {playlist.map((track, idx) => (
              <div key={idx} className="flex items-center bg-white/80 rounded-lg p-4 shadow hover:bg-amber-100/60 transition">
                <div className="w-20 h-20 rounded-lg mr-4 border border-amber-200 overflow-hidden bg-amber-100 flex items-center justify-center shadow-md hover:shadow-lg transition-shadow">
                  <img 
                    src={track.albumImage} 
                    alt={track.albumName} 
                    className="w-full h-full object-cover"
                    onLoad={() => console.log('Successfully loaded image:', track.albumImage)}
                    onError={(e) => {
                      console.log('Failed to load image:', track.albumImage);
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="hidden w-full h-full items-center justify-center text-amber-600 bg-amber-50">
                    <i className="fa-solid fa-music text-xl"></i>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-amber-900 truncate">{track.name}</div>
                  <div className="text-amber-700 text-sm truncate">{track.albumArtist} — <span className="italic">{track.albumName}</span></div>
                </div>
                <a href={track.albumSpotify} target="_blank" rel="noopener noreferrer" className="ml-4 text-amber-600 hover:text-green-600">
                  <i className="fa-brands fa-spotify text-2xl"></i>
                </a>
              </div>
            ))}
          {/* Spotify Playlist Button */}
          <div className="flex justify-center mt-10">
            {isAuthenticated ? (
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full text-lg font-semibold shadow vinyl-shadow flex items-center gap-3 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleCreateSpotifyPlaylist}
                disabled={isCreatingPlaylist}
              >
                {isCreatingPlaylist ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin text-2xl"></i>
                    Creating playlist...
                  </>
                ) : (
                  <>
                    <i className="fa-brands fa-spotify text-2xl"></i>
                    Create this playlist on Spotify
                  </>
                )}
              </button>
            ) : (
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full text-lg font-semibold shadow vinyl-shadow flex items-center gap-3 transition-all duration-200"
                onClick={loginWithSpotify}
              >
                <i className="fa-brands fa-spotify text-2xl"></i>
                Log in with Spotify to create this playlist
              </button>
            )}
          </div>
        </div>
      </main>
      <footer className="bg-gradient-to-r from-amber-100 to-orange-100 border-t border-amber-200 py-8 mt-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-amber-700 mb-4">Crafted with love by Medha • Powered by Spotify</p>
        </div>
      </footer>
      <style>{`
        .serif { font-family: 'Crimson Text', serif; }
        .vinyl-shadow { box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), inset 0 2px 4px rgba(255, 255, 255, 0.1); }
      `}</style>
    </div>
  );
} 