import React from 'react'
import { motion } from 'framer-motion'

const Navigation = ({ onOpenPlaylist, onBack, playlistCount }) => {
  return (
    <div className="absolute top-0 left-0 right-0 z-20 p-6">
      <div className="flex justify-between items-center">
        {/* Back Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="bg-white/70 backdrop-blur-sm text-amber-900 font-medium px-4 py-2 rounded-lg border border-amber-200 hover:bg-amber-100/70 hover:border-amber-300 transition-all duration-200"
        >
          <span className="flex items-center space-x-2">
            <i className="fa-solid fa-arrow-left text-sm"></i>
            <span>Back</span>
          </span>
        </motion.button>

        {/* Center Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-center"
        >
          <h1 className="serif text-2xl font-semibold text-amber-900 italic">
            "Your Soundscape"
          </h1>
          <p className="text-amber-700 text-sm">
            Explore your curated collection
          </p>
        </motion.div>

        {/* Playlist Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onOpenPlaylist}
          className="bg-gradient-to-r from-amber-600 to-orange-700 text-white font-medium px-4 py-2 rounded-lg hover:from-amber-700 hover:to-orange-800 transition-all duration-200 shadow-vinyl hover:shadow-vinyl-lg relative"
        >
          <span className="flex items-center space-x-2">
            <i className="fa-solid fa-music text-sm"></i>
            <span>Playlist</span>
          </span>
          
          {/* Playlist Counter Badge */}
          {playlistCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center"
            >
              {playlistCount}
            </motion.div>
          )}
        </motion.button>
      </div>
    </div>
  )
}

export default Navigation 