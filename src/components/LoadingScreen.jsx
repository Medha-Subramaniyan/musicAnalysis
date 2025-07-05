import React from 'react'
import { motion } from 'framer-motion'

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center z-50">
      <div className="text-center">
        {/* Vinyl Record Animation */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-32 h-32 mx-auto mb-8 relative"
        >
          {/* Vinyl Record */}
          <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-800 to-orange-900 shadow-2xl relative overflow-hidden">
            {/* Vinyl Grooves */}
            <div className="absolute inset-4 rounded-full bg-amber-900"></div>
            <div className="absolute inset-6 rounded-full bg-amber-800"></div>
            <div className="absolute inset-8 rounded-full bg-amber-900"></div>
            <div className="absolute inset-10 rounded-full bg-amber-800"></div>
            
            {/* Center Label */}
            <div className="absolute inset-12 rounded-full bg-amber-50 flex items-center justify-center">
              <div className="text-center">
                <div className="w-4 h-4 rounded-full bg-amber-900 mx-auto mb-1"></div>
                <div className="text-xs font-semibold text-amber-800 font-medium">ROOM</div>
              </div>
            </div>
          </div>
          
          {/* Tonearm */}
          <motion.div
            animate={{ rotate: [0, 15, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-16 bg-amber-600 origin-bottom"
            style={{ transformOrigin: 'bottom center' }}
          >
            <div className="absolute bottom-0 w-3 h-3 bg-amber-600 rounded-full"></div>
          </motion.div>
        </motion.div>

        {/* Loading Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="space-y-4"
        >
          <h1 className="serif text-4xl font-semibold text-amber-900 italic">
            "Loading Your Soundscape"
          </h1>
          <p className="text-amber-700 text-lg">
            Preparing your personalized music experience...
          </p>
          
          {/* Loading Dots */}
          <div className="flex justify-center space-x-2 mt-6">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity, 
                  delay: i * 0.2 
                }}
                className="w-3 h-3 bg-amber-500 rounded-full"
              />
            ))}
          </div>
        </motion.div>

        {/* Subtle Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{ 
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-20 left-20 w-20 h-20 bg-amber-200 rounded-full blur-xl"
          />
          <motion.div
            animate={{ 
              opacity: [0.2, 0.4, 0.2],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 3, repeat: Infinity, delay: 1 }}
            className="absolute bottom-20 right-20 w-16 h-16 bg-orange-200 rounded-full blur-xl"
          />
        </div>
      </div>
    </div>
  )
}

export default LoadingScreen 