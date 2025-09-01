'use client'

import { motion } from 'framer-motion'

export default function LoadingSkeleton() {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div className="text-center">
        {/* Animated logo/icon */}
        <motion.div
          className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-orange-500 to-red-600"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Loading text */}
        <motion.h1
          className="text-3xl font-bold text-white mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Sofia Ferro
        </motion.h1>
        
        <motion.p
          className="text-white/70 text-lg mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          Loading Interactive Portfolio...
        </motion.p>
        
        {/* Animated dots */}
        <div className="flex justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-orange-500 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
        
        {/* Progress bar */}
        <motion.div
          className="w-64 h-1 bg-white/20 rounded-full mt-8 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-orange-500 to-red-600 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{
              duration: 3,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      </div>
    </div>
  )
}
