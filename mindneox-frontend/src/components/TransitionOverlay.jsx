import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

export default function TransitionOverlay() {
  const [isTransitioning, setIsTransitioning] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setIsTransitioning(true)
    
    const timer = setTimeout(() => {
      setIsTransitioning(false)
    }, 400)

    return () => clearTimeout(timer)
  }, [location.pathname])

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          exit={{ scaleY: 0 }}
          transition={{
            duration: 0.4,
            ease: [0.22, 1, 0.36, 1]
          }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9997,
            background: 'linear-gradient(135deg, rgba(0, 180, 255, 0.1), rgba(125, 79, 255, 0.1))',
            backdropFilter: 'blur(20px)',
            transformOrigin: 'top',
            pointerEvents: 'none'
          }}
        />
      )}
    </AnimatePresence>
  )
}
