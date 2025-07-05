import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAlbumData } from '@hooks/useAlbumData'
import { useMusicRoomState } from '@hooks/useMusicRoomState'

const GenreSelector = ({ onSelection, onBack }) => {
  const { albums } = useAlbumData()
  const { getAllGenres, getAllMoods } = useMusicRoomState()
  
  const [selectedGenres, setSelectedGenres] = useState([])
  const [selectedMoods, setSelectedMoods] = useState([])
  const [availableGenres, setAvailableGenres] = useState([])
  const [availableMoods, setAvailableMoods] = useState([])

  useEffect(() => {
    console.log('GenreSelector: albums loaded', albums.length)
    if (albums.length > 0) {
      const genres = getAllGenres(albums)
      const moods = getAllMoods(albums)
      console.log('Available genres:', genres)
      console.log('Available moods:', moods)
      setAvailableGenres(genres)
      setAvailableMoods(moods)
    }
  }, [albums, getAllGenres, getAllMoods])

  const toggleGenre = (genre) => {
    setSelectedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    )
  }

  const toggleMood = (mood) => {
    setSelectedMoods(prev => 
      prev.includes(mood) 
        ? prev.filter(m => m !== mood)
        : [...prev, mood]
    )
  }

  const handleContinue = () => {
    onSelection(selectedGenres, selectedMoods)
  }

  const handleBack = () => {
    onBack()
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center p-6">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-100/50 to-orange-100/50"></div>
      
      {/* Main Content */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-4xl"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h1 className="serif text-4xl md:text-5xl font-semibold text-amber-900 mb-4 italic">
            "Choose Your Vibe"
          </h1>
          <p className="text-xl text-amber-700 max-w-2xl mx-auto">
            Select your favorite genres and moods to get personalized recommendations
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Genres Section */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-amber-900 mb-3">Choose Your Genres</h3>
              <p className="text-amber-700">Select the sounds that speak to you</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {availableGenres.length === 0 ? (
                <div className="col-span-full text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
                  <p className="text-amber-600">Loading genres...</p>
                </div>
              ) : (
                availableGenres.map((genre, index) => (
                <motion.div
                  key={genre}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleGenre(genre)}
                  className={`genre-chip bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center cursor-pointer border border-amber-200 vinyl-shadow hover:bg-amber-100/70 ${
                    selectedGenres.includes(genre) ? 'selected' : ''
                  }`}
                >
                  <i className={`text-2xl mb-2 ${
                    genre === 'Hip-Hop' ? 'fa-solid fa-microphone' :
                    genre === 'Rap' ? 'fa-solid fa-music' :
                    genre === 'Alternative Hip-Hop' ? 'fa-solid fa-headphones' :
                    genre === 'Conscious Rap' ? 'fa-solid fa-brain' :
                    genre === 'R&B' ? 'fa-solid fa-heart' :
                    genre === 'Soul' ? 'fa-solid fa-fire' :
                    genre === 'Jazz' ? 'fa-solid fa-saxophone' :
                    genre === 'Electronic' ? 'fa-solid fa-wave-square' :
                    genre === 'House' ? 'fa-solid fa-home' :
                    genre === 'Trap' ? 'fa-solid fa-bolt' :
                    genre === 'Neo-Soul' ? 'fa-solid fa-star' :
                    genre === 'Soundtrack' ? 'fa-solid fa-film' :
                    'fa-solid fa-music'
                  } text-amber-700`}></i>
                  <p className="font-medium text-amber-900">{genre}</p>
                </motion.div>
              ))
              )}
            </div>
          </motion.div>

          {/* Moods Section */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-amber-900 mb-3">Set Your Mood</h3>
              <p className="text-amber-700">How are you feeling today?</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {availableMoods.length === 0 ? (
                <div className="col-span-full text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
                  <p className="text-amber-600">Loading moods...</p>
                </div>
              ) : (
                availableMoods.map((mood, index) => (
                <motion.span
                  key={mood}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleMood(mood)}
                  className={`mood-pill bg-white/70 backdrop-blur-sm px-4 py-3 rounded-full cursor-pointer border border-amber-200 text-amber-900 hover:bg-amber-100/70 transition-all text-center ${
                    selectedMoods.includes(mood) ? 'selected' : ''
                  }`}
                >
                  <i className={`mr-2 ${
                    mood === 'Energetic' ? 'fa-solid fa-bolt' :
                    mood === 'Chill' ? 'fa-solid fa-leaf' :
                    mood === 'Confident' ? 'fa-solid fa-crown' :
                    mood === 'Melancholic' ? 'fa-solid fa-cloud-rain' :
                    mood === 'Nostalgic' ? 'fa-solid fa-clock-rotate-left' :
                    mood === 'Groovy' ? 'fa-solid fa-guitar' :
                    mood === 'Smooth' ? 'fa-solid fa-water' :
                    mood === 'Empowering' ? 'fa-solid fa-fist-raised' :
                    mood === 'Reflective' ? 'fa-solid fa-mirror' :
                    mood === 'Atmospheric' ? 'fa-solid fa-cloud' :
                    mood === 'Playful' ? 'fa-solid fa-smile' :
                    mood === 'Sensual' ? 'fa-solid fa-heart' :
                    mood === 'Dark' ? 'fa-solid fa-moon' :
                    mood === 'Experimental' ? 'fa-solid fa-flask' :
                    mood === 'Thoughtful' ? 'fa-solid fa-lightbulb' :
                    mood === 'Hype' ? 'fa-solid fa-fire' :
                    mood === 'Serious' ? 'fa-solid fa-balance-scale' :
                    'fa-solid fa-heart'
                  }`}></i>
                  {mood}
                </motion.span>
              ))
              )}
            </div>
          </motion.div>
        </div>

        {/* Selection Summary */}
        <motion.div 
          variants={itemVariants}
          className="mt-12 text-center"
        >
          <div className="card-glass inline-block p-6">
            <h3 className="font-semibold text-amber-900 mb-3">
              Your Selection
            </h3>
            <div className="space-y-2">
              {selectedGenres.length > 0 && (
                <div>
                  <span className="text-amber-700">Genres: </span>
                  <span className="text-amber-900 font-medium">
                    {selectedGenres.join(', ')}
                  </span>
                </div>
              )}
              {selectedMoods.length > 0 && (
                <div>
                  <span className="text-amber-700">Moods: </span>
                  <span className="text-amber-900 font-medium">
                    {selectedMoods.join(', ')}
                  </span>
                </div>
              )}
              {selectedGenres.length === 0 && selectedMoods.length === 0 && (
                <p className="text-amber-600">
                  Select at least one genre or mood to continue
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          variants={itemVariants}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleContinue}
            disabled={selectedGenres.length === 0 && selectedMoods.length === 0}
            className={`bg-gradient-to-r from-amber-600 to-orange-700 text-white px-12 py-4 rounded-full text-lg font-semibold hover:from-amber-700 hover:to-orange-800 transition-all duration-300 vinyl-shadow transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
              selectedGenres.length === 0 && selectedMoods.length === 0
                ? 'opacity-50 cursor-not-allowed'
                : ''
            }`}
          >
            <span className="flex items-center space-x-2">
              <i className="fa-solid fa-magic-wand-sparkles mr-3"></i>
              <span>Curate My Soundscape</span>
            </span>
          </motion.button>
          <p className="text-amber-600 mt-4 text-sm">Select at least one genre and mood to continue</p>
        </motion.div>
      </motion.div>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ 
            y: [0, -30, 0],
            rotate: [0, 10, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -right-20 -top-10 w-40 h-40 bg-amber-200/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            y: [0, 30, 0],
            rotate: [0, -10, 0]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -left-20 -bottom-10 w-32 h-32 bg-orange-200/30 rounded-full blur-2xl"
        />
      </div>
    </div>
  )
}

export default GenreSelector 