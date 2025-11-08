import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wifi, WifiOff } from 'lucide-react'

export default function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(true)
  const [isSlowConnection, setIsSlowConnection] = useState(false)
  const [showNotification, setShowNotification] = useState(false)

  useEffect(() => {
    // Check online/offline status
    const handleOnline = () => {
      setIsOnline(true)
      setShowNotification(true)
      setTimeout(() => setShowNotification(false), 3000)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowNotification(true)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Check connection speed
    if ('connection' in navigator) {
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
      
      const checkSpeed = () => {
        if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
          setIsSlowConnection(true)
          setShowNotification(true)
        } else {
          setIsSlowConnection(false)
        }
      }

      checkSpeed()
      connection.addEventListener('change', checkSpeed)

      return () => {
        window.removeEventListener('online', handleOnline)
        window.removeEventListener('offline', handleOffline)
        connection.removeEventListener('change', checkSpeed)
      }
    }

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return (
    <AnimatePresence>
      {showNotification && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-[9999] pointer-events-none"
        >
          <motion.div
            animate={isOnline ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 0.3 }}
            className={`glass-card px-6 py-3 rounded-full flex items-center gap-3 shadow-2xl ${
              isOnline 
                ? 'border-green-500/50 bg-green-500/10' 
                : 'border-red-500/50 bg-red-500/10'
            }`}
          >
            <motion.div
              animate={{ rotate: isOnline ? [0, 360] : 0 }}
              transition={{ duration: 0.6 }}
            >
              {isOnline ? (
                <Wifi className="w-5 h-5 text-green-400" />
              ) : (
                <WifiOff className="w-5 h-5 text-red-400" />
              )}
            </motion.div>
            
            <div className="text-sm font-medium">
              {!isOnline && (
                <span className="text-red-400">You're offline</span>
              )}
              {isOnline && isSlowConnection && (
                <span className="text-yellow-400">Slow connection detected</span>
              )}
              {isOnline && !isSlowConnection && (
                <span className="text-green-400">Back online</span>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
