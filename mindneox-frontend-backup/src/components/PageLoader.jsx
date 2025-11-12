import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import LoadingSpinner from './LoadingSpinner'

export default function PageLoader() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate initial load
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9998] flex items-center justify-center bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-6"
          >
            <LoadingSpinner size="lg" />
            
            <motion.div
              animate={{
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              className="flex flex-col items-center gap-2"
            >
              <p className="text-lg font-semibold gradient-text">
                MindNeox.AI
              </p>
              <p className="text-sm text-white/50">
                Loading your AI experience...
              </p>
            </motion.div>

            {/* Loading bar */}
            <motion.div
              className="w-48 h-1 bg-white/10 rounded-full overflow-hidden"
            >
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                className="h-full w-1/3 bg-gradient-to-r from-neon-cyan via-neon-magenta to-neon-cyan"
                style={{
                  boxShadow: '0 0 20px rgba(0, 180, 255, 0.5)'
                }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
