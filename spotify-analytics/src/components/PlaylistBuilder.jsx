import React, { useState } from 'react'
import { motion, AnimatePresence, Reorder } from 'framer-motion'

const PlaylistBuilder = ({ playlist, onAdd, onRemove, onClear, onBack }) => {
  const [playlistName, setPlaylistName] = useState('My Music Room Playlist')
  const [isExporting, setIsExporting] = useState(false)

  const handleExportToSpotify = async () => {
    setIsExporting(true)
    // Simulate Spotify API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsExporting(false)
    // Here you would integrate with Spotify Web API
    alert('Playlist exported to Spotify! (Demo mode)')
  }

  const handleShare = () => {
    const playlistData = {
      name: playlistName,
      tracks: playlist.map(album => ({
        name: album.name,
        artist: album.artist,
        spotifyUrl: album.spotifyUrl
      }))
    }
    
    const shareText = `Check out my curated playlist: ${playlistName}\n\n${playlistData.tracks.map(track => `${track.name} - ${track.artist}`).join('\n')}`
    
    if (navigator.share) {
      navigator.share({
        title: playlistName,
        text: shareText,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(shareText)
      alert('Playlist copied to clipboard!')
    }
  }

  return (
    <div className="fixed inset-0 bg-amber-900/20 backdrop-blur-sm flex items-center justify-center p-6 z-30">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, x: 300 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        exit={{ opacity: 0, scale: 0.9, x: 300 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-amber-200"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 to-orange-700 p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-semibold">Playlist Builder</h2>
              <p className="text-amber-100">
                {playlist.length} albums in your collection
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="text-white hover:text-amber-100 transition-colors"
            >
              <i className="fa-solid fa-times text-xl"></i>
            </motion.button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Playlist Name Input */}
          <div className="mb-6">
            <label className="block text-amber-700 font-medium mb-2">
              Playlist Name
            </label>
            <input
              type="text"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Enter playlist name..."
            />
          </div>

          {/* Playlist Items */}
          {playlist.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-music text-2xl text-amber-400"></i>
              </div>
              <h3 className="text-lg font-semibold text-amber-700 mb-2">
                Your playlist is empty
              </h3>
              <p className="text-amber-500">
                Add albums from the music room to build your collection
              </p>
            </div>
          ) : (
            <Reorder.Group
              axis="y"
              values={playlist}
              onReorder={() => {}} // You can implement reordering logic here
              className="space-y-3"
            >
              <AnimatePresence>
                {playlist.map((album, index) => (
                  <Reorder.Item
                    key={album.id}
                    value={album}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center space-x-4 p-4 bg-amber-50 rounded-lg border border-amber-200"
                    >
                      {/* Album Cover */}
                      <div className="flex-shrink-0">
                        <img
                          src={album.imageUrl}
                          alt={album.name}
                          className="w-12 h-12 rounded-lg object-cover shadow-sm"
                        />
                      </div>

                      {/* Album Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-amber-900 truncate">
                          {album.name}
                        </h4>
                        <p className="text-amber-600 text-sm truncate">
                          {album.artist}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          {album.genres.slice(0, 2).map((genre, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full"
                            >
                              {genre}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => window.open(album.spotifyUrl, '_blank')}
                          className="p-2 text-amber-600 hover:text-amber-700 hover:bg-amber-100 rounded-lg transition-colors"
                          title="Open in Spotify"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                          </svg>
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => onRemove(album.id)}
                          className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove from playlist"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </motion.button>
                      </div>
                    </motion.div>
                  </Reorder.Item>
                ))}
              </AnimatePresence>
            </Reorder.Group>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-amber-200 p-6 bg-amber-50">
          <div className="flex justify-between items-center">
            <div className="flex space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClear}
                disabled={playlist.length === 0}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  playlist.length === 0
                    ? 'bg-amber-200 text-amber-400 cursor-not-allowed'
                    : 'bg-red-100 text-red-600 hover:bg-red-200'
                }`}
              >
                Clear All
              </motion.button>
            </div>

            <div className="flex space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleShare}
                disabled={playlist.length === 0}
                className={`bg-white/70 backdrop-blur-sm text-amber-900 font-medium px-4 py-2 rounded-lg border border-amber-200 hover:bg-amber-100/70 hover:border-amber-300 transition-all duration-200 ${
                  playlist.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <span className="flex items-center space-x-2">
                  <i className="fa-solid fa-share text-sm"></i>
                  <span>Share</span>
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleExportToSpotify}
                disabled={playlist.length === 0 || isExporting}
                className={`bg-gradient-to-r from-amber-600 to-orange-700 text-white font-medium px-4 py-2 rounded-lg hover:from-amber-700 hover:to-orange-800 transition-all duration-200 shadow-vinyl hover:shadow-vinyl-lg ${
                  playlist.length === 0 || isExporting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <span className="flex items-center space-x-2">
                  {isExporting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <i className="fa-brands fa-spotify text-sm"></i>
                  )}
                  <span>{isExporting ? 'Exporting...' : 'Export to Spotify'}</span>
                </span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default PlaylistBuilder 