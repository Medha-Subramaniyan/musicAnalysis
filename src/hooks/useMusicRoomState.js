import { useState, useCallback } from 'react'

export function useMusicRoomState() {
  const [selectedGenres, setSelectedGenres] = useState([])
  const [selectedMoods, setSelectedMoods] = useState([])
  const [playlist, setPlaylist] = useState([])
  const [recommendations, setRecommendations] = useState([])

  // Generate recommendations based on selected genres and moods
  const generateRecommendations = useCallback((albums, genres, moods) => {
    if (!albums || albums.length === 0) return

    let filteredAlbums = albums

    // Filter by genres if selected
    if (genres && genres.length > 0) {
      filteredAlbums = filteredAlbums.filter(album => 
        album.genres && album.genres.some(genre => genres.includes(genre))
      )
    }

    // Filter by moods if selected
    if (moods && moods.length > 0) {
      filteredAlbums = filteredAlbums.filter(album => 
        album.moods && album.moods.some(mood => moods.includes(mood))
      )
    }

    // Sort by popularity and limit to top recommendations
    const sortedAlbums = filteredAlbums
      .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
      .slice(0, 10)

    setRecommendations(sortedAlbums)
  }, [])

  // Add album to playlist
  const addToPlaylist = useCallback((album) => {
    setPlaylist(prev => {
      // Check if album is already in playlist
      if (prev.find(item => item.id === album.id)) {
        return prev
      }
      return [...prev, album]
    })
  }, [])

  // Remove album from playlist
  const removeFromPlaylist = useCallback((albumId) => {
    setPlaylist(prev => prev.filter(album => album.id !== albumId))
  }, [])

  // Clear entire playlist
  const clearPlaylist = useCallback(() => {
    setPlaylist([])
  }, [])

  // Get all available genres from albums
  const getAllGenres = useCallback((albums) => {
    const genres = new Set()
    albums.forEach(album => {
      if (album.genres) {
        album.genres.forEach(genre => genres.add(genre))
      }
    })
    return Array.from(genres).sort()
  }, [])

  // Get all available moods from albums
  const getAllMoods = useCallback((albums) => {
    const moods = new Set()
    albums.forEach(album => {
      if (album.moods) {
        album.moods.forEach(mood => moods.add(mood))
      }
    })
    return Array.from(moods).sort()
  }, [])

  return {
    selectedGenres,
    selectedMoods,
    playlist,
    recommendations,
    setSelectedGenres,
    setSelectedMoods,
    addToPlaylist,
    removeFromPlaylist,
    clearPlaylist,
    generateRecommendations,
    getAllGenres,
    getAllMoods
  }
} 