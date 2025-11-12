import { motion } from 'framer-motion'
import { useEffect } from 'react'

const pageVariants = {
  initial: {
    opacity: 0,
    y: 40,
    scale: 0.96
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.1
    }
  },
  exit: {
    opacity: 0,
    y: -40,
    scale: 0.96,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1]
    }
  }
}

export default function PageTransition({ children }) {
  useEffect(() => {
    // Ensure page starts at top
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }, [])

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{
        width: '100%',
        minHeight: '100vh',
        willChange: 'transform, opacity',
        position: 'relative'
      }}
    >
      {children}
    </motion.div>
  )
}
