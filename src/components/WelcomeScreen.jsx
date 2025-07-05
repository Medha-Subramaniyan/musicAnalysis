import React from 'react'
import { motion } from 'framer-motion'

const WelcomeScreen = ({ onStart }) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-100/50 to-orange-100/50"></div>
      
      {/* Main Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="space-y-8"
        >
          {/* Title */}
          <div className="space-y-4">
            <motion.h1 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="serif text-4xl md:text-5xl font-semibold text-amber-900 mb-4 italic"
            >
              "Music is the soundtrack to your soul"
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-lg text-amber-700 mb-8 leading-relaxed"
            >
              Let me curate the perfect soundscape based on your vibe today
            </motion.p>
          </div>

          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex justify-center space-x-12 text-center"
          >
            <div className="space-y-2">
              <div className="text-3xl font-semibold text-amber-900">40</div>
              <div className="text-amber-700">Albums</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-semibold text-amber-900">18</div>
              <div className="text-amber-700">Genres</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-semibold text-amber-900">17</div>
              <div className="text-amber-700">Moods</div>
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="pt-8"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={onStart}
              className="bg-gradient-to-r from-amber-600 to-orange-700 text-white px-12 py-4 rounded-full text-lg font-semibold hover:from-amber-700 hover:to-orange-800 transition-all duration-300 vinyl-shadow transform hover:scale-105"
            >
              <span className="flex items-center space-x-3">
                <i className="fa-solid fa-magic-wand-sparkles text-xl"></i>
                <span>Curate My Soundscape</span>
              </span>
            </motion.button>
          </motion.div>

          {/* Features */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-12 max-w-2xl mx-auto"
          >
            <div className="card-glass text-center p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-orange-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-magic-wand-sparkles text-white text-lg"></i>
              </div>
              <h3 className="font-semibold text-amber-900 mb-2">Smart Recommendations</h3>
              <p className="text-amber-700 text-sm">Get personalized suggestions based on your vibe</p>
            </div>

            <div className="card-glass text-center p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-orange-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-music text-white text-lg"></i>
              </div>
              <h3 className="font-semibold text-amber-900 mb-2">Playlist Builder</h3>
              <p className="text-amber-700 text-sm">Create and share your perfect music collection</p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -right-20 -top-10 w-40 h-40 bg-amber-200/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -left-20 -bottom-10 w-32 h-32 bg-orange-200/30 rounded-full blur-2xl"
        />
      </div>
    </div>
  )
}

export default WelcomeScreen 