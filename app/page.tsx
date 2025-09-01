'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ShaderBackground from '@/components/shader-background'
import InteractiveMap from '@/components/interactive-map'
import LoadingSkeleton from '@/components/loading-skeleton'

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [showMap, setShowMap] = useState(false)
  
  useEffect(() => {
    // Simulate loading time for shader initialization
    const timer = setTimeout(() => {
      setIsLoading(false)
      // Small delay before showing the map for smooth transition
      setTimeout(() => setShowMap(true), 500)
    }, 3000)
    
    return () => clearTimeout(timer)
  }, [])
  
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Shader Background */}
      <ShaderBackground />
      
      {/* Loading Screen */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <LoadingSkeleton />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Interactive Map */}
      <AnimatePresence>
        {showMap && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              duration: 1,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          >
            <InteractiveMap />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Welcome Overlay */}
      {!isLoading && !showMap && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="text-center text-white">
            <motion.h1
              className="text-6xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Sofia Ferro
            </motion.h1>
            <motion.p
              className="text-xl text-white/80 mb-8"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Interactive Portfolio Experience
            </motion.p>
            <motion.div
              className="w-16 h-16 mx-auto border-2 border-orange-400 rounded-full border-t-transparent animate-spin"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            />
          </div>
        </motion.div>
      )}
    </div>
  )
} 