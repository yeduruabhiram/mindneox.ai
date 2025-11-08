import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Brain } from 'lucide-react'

export default function SplashScreen({ onComplete }) {
  const [stage, setStage] = useState('mentneo')

  useEffect(() => {
    const timer1 = setTimeout(() => setStage('logo'), 2000)
    const timer2 = setTimeout(() => {
      setStage('complete')
      setTimeout(() => onComplete(), 500)
    }, 5000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [onComplete])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: stage === 'complete' ? 0 : 1 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1a1d2e, #2a2d3e)',
        color: '#fff'
      }}
    >
      {/* Mentneo Presents */}
      <AnimatePresence>
        {stage === 'mentneo' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.15 }}
            transition={{ duration: 0.7 }}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center'
            }}
          >
            <motion.p
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: '#fff',
                fontWeight: '400'
              }}
            >
              Mentneo Presents
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MindNeox.AI Splash */}
      <AnimatePresence>
        {stage === 'logo' && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.8 }}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem'
            }}
          >
            {/* Breathing Glow Circle */}
            <motion.div
              animate={{ scale: [1, 1.07, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                width: '140px',
                height: '140px',
                borderRadius: '50%',
                border: '3px solid rgba(0, 180, 255, 0.35)',
                background: 'rgba(0, 180, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 30px rgba(0, 180, 255, 0.4)'
              }}
            >
              <Brain size={65} color="#00B4FF" style={{ filter: 'drop-shadow(0 0 12px rgba(0, 180, 255, 0.9))' }} />
            </motion.div>

            {/* Breathing Title */}
            <motion.h1
              animate={{ opacity: [0.85, 1, 0.85] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                fontSize: 'clamp(2.7rem, 6vw, 4.3rem)',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #00B4FF, #7D4FFF, #FF00C8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              MindNeox.AI
            </motion.h1>

            <motion.p style={{ opacity: 0.75, fontSize: 'clamp(1rem, 2vw, 1.3rem)' }}>
              The First AI Operating System
            </motion.p>

            {/* Loading Bar */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '220px' }}
              transition={{ delay: 0.6, duration: 2, ease: 'easeInOut' }}
              style={{
                height: '3px',
                borderRadius: '20px',
                background: 'linear-gradient(90deg, #00B4FF, #7D4FFF, #FF00C8)'
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  )
}
