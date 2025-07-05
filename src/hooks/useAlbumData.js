import { useState, useEffect } from 'react'

export function useAlbumData() {
  const [albums, setAlbums] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadAlbumData = async () => {
      try {
        setLoading(true)
        
        // Load the album data with metadata
        const response = await fetch('/data/ROOM_playlist_album_image_mapping_with_metadata.json')
        if (!response.ok) {
          throw new Error('Failed to load album data')
        }
        
        const albumData = await response.json()
        
        // Transform the data for easier use
        const transformedAlbums = albumData.map(album => ({
          ...album,
          id: album.rank,
          // Use Spotify image URL instead of local image path for deployment compatibility
          imageUrl: album.spotify_image_url || album.local_image,
          spotifyUrl: album.spotify_url,
          popularity: album.avg_popularity,
          // Ensure arrays exist
          genres: album.genres || [],
          moods: album.moods || [],
          topTracks: album.top_tracks || []
        }))
        
        console.log('Album data loaded:', transformedAlbums.length, 'albums')
        console.log('Sample album:', transformedAlbums[0])
        setAlbums(transformedAlbums)
        setError(null)
      } catch (err) {
        console.error('Error loading album data:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadAlbumData()
  }, [])

  return { albums, loading, error }
} 