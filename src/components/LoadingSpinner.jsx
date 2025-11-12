import { motion } from 'framer-motion'
import { Brain } from 'lucide-react'

export default function LoadingSpinner({ size = 'md', fullScreen = false }) {
  const sizes = {
    sm: { container: 'w-8 h-8', icon: 20 },
    md: { container: 'w-12 h-12', icon: 28 },
    lg: { container: 'w-16 h-16', icon: 36 }
  }

  const currentSize = sizes[size]

  const spinner = (
    <motion.div
      className="flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className={`${currentSize.container} relative flex items-center justify-center`}
      >
        {/* Rotating outer ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear'
          }}
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-neon-cyan border-r-neon-magenta"
          style={{
            boxShadow: '0 0 20px rgba(0, 180, 255, 0.5)'
          }}
        />
        
        {/* Pulsing brain icon */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          <Brain 
            size={currentSize.icon} 
            className="text-neon-cyan"
            style={{
              filter: 'drop-shadow(0 0 10px rgba(0, 180, 255, 0.8))'
            }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  )

  if (fullScreen) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9998] flex items-center justify-center bg-dark-900/80 backdrop-blur-sm"
      >
        <div className="flex flex-col items-center gap-4">
          {spinner}
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="text-sm text-white/70 font-medium"
          >
            Loading...
          </motion.p>
        </div>
      </motion.div>
    )
  }

  return spinner
}
