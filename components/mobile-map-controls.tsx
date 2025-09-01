'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Map, Home, ZoomIn, ZoomOut, Menu, X } from 'lucide-react'

interface MobileMapControlsProps {
  onZoomIn: () => void
  onZoomOut: () => void
  onReset: () => void
  onToggleMenu: () => void
  isMenuOpen: boolean
}

export default function MobileMapControls({
  onZoomIn,
  onZoomOut,
  onReset,
  onToggleMenu,
  isMenuOpen
}: MobileMapControlsProps) {
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    // Show controls after a short delay
    const timer = setTimeout(() => setIsVisible(true), 1000)
    return () => clearTimeout(timer)
  }, [])
  
  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Main Controls */}
          <motion.div
            className="fixed bottom-6 left-6 z-50 md:hidden"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <div className="flex flex-col gap-3">
              {/* Zoom Controls */}
              <motion.button
                className="p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white shadow-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onZoomIn}
              >
                <ZoomIn className="w-6 h-6" />
              </motion.button>
              
              <motion.button
                className="p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white shadow-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onZoomOut}
              >
                <ZoomOut className="w-6 h-6" />
              </motion.button>
              
              {/* Reset Button */}
              <motion.button
                className="p-4 bg-orange-500/20 backdrop-blur-md border border-orange-400/30 rounded-2xl text-orange-400 shadow-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onReset}
              >
                <Home className="w-6 h-6" />
              </motion.button>
            </div>
          </motion.div>
          
          {/* Menu Toggle */}
          <motion.button
            className="fixed top-6 right-6 z-50 p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white shadow-lg md:hidden"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onToggleMenu}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </>
      )}
    </AnimatePresence>
  )
}

// Touch gesture handler for mobile
export function useTouchGestures(
  onPan: (deltaX: number, deltaY: number) => void,
  onZoom: (delta: number) => void
) {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number; distance: number } | null>(null)
  
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setTouchStart({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        distance: 0
      })
    } else if (e.touches.length === 2) {
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      )
      setTouchStart({
        x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
        y: (e.touches[0].clientY + e.touches[1].clientY) / 2,
        distance
      })
    }
  }
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return
    
    if (e.touches.length === 1) {
      // Single touch - pan
      const deltaX = e.touches[0].clientX - touchStart.x
      const deltaY = e.touches[0].clientY - touchStart.y
      onPan(deltaX, deltaY)
      setTouchStart({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        distance: 0
      })
    } else if (e.touches.length === 2) {
      // Two touches - zoom
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      )
      const delta = distance - touchStart.distance
      onZoom(delta > 0 ? 1 : -1)
      setTouchStart({
        x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
        y: (e.touches[0].clientY + e.touches[1].clientY) / 2,
        distance
      })
    }
  }
  
  const handleTouchEnd = () => {
    setTouchStart(null)
  }
  
  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  }
}
