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
        background: 'linear-gradient(135deg, #0f172a, #1e293b, #0f172a)',
        color: '#fff',
        overflow: 'hidden'
      }}
    >
      {/* Animated Background Grid */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
        opacity: 0.3
      }} />
      {/* Mentneo Presents - Perfectly Centered */}
      <AnimatePresence>
        {stage === 'mentneo' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.15 }}
            transition={{ duration: 0.7 }}
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              zIndex: 1
            }}
          >
            <div>
              {/* Hexagonal Glow Effect */}
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '400px',
                  height: '400px',
                  background: 'radial-gradient(circle, rgba(99, 102, 241, 0.3), transparent 70%)',
                  filter: 'blur(40px)',
                  pointerEvents: 'none'
                }}
              />
              
              <motion.p
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  position: 'relative',
                  fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                  letterSpacing: '0.4em',
                  textTransform: 'uppercase',
                  color: '#fff',
                  fontWeight: '300',
                  fontFamily: 'monospace'
                }}
              >
                Mentneo Presents
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MindNeox.AI Splash - Perfectly Centered */}
      <AnimatePresence>
        {stage === 'logo' && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.8 }}
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1
            }}
          >
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2rem',
              textAlign: 'center',
              padding: '2rem'
            }}>
              {/* Hexagonal Energy Field */}
              <motion.div
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
                  scale: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
                }}
                style={{
                  position: 'absolute',
                  width: '500px',
                  height: '500px',
                  background: 'conic-gradient(from 0deg, rgba(99, 102, 241, 0.2), rgba(16, 185, 129, 0.2), rgba(139, 92, 246, 0.2), rgba(99, 102, 241, 0.2))',
                  filter: 'blur(60px)',
                  opacity: 0.6,
                  pointerEvents: 'none'
                }}
              />

              {/* Brain Icon with Glow */}
              <motion.div
                animate={{ 
                  scale: [1, 1.05, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  scale: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
                  rotate: { duration: 4, repeat: Infinity, ease: 'easeInOut' }
                }}
                style={{
                  position: 'relative',
                  width: '160px',
                  height: '160px',
                  borderRadius: '50%',
                  border: '3px solid rgba(99, 102, 241, 0.4)',
                  background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15), transparent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 40px rgba(99, 102, 241, 0.5), inset 0 0 20px rgba(99, 102, 241, 0.2)'
                }}
              >
                {/* Rotating Ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                  style={{
                    position: 'absolute',
                    inset: '-10px',
                    border: '2px solid transparent',
                    borderTopColor: 'rgba(16, 185, 129, 0.6)',
                    borderRadius: '50%'
                  }}
                />
                
                <Brain size={75} color="#6366f1" style={{ 
                  filter: 'drop-shadow(0 0 15px rgba(99, 102, 241, 0.8))',
                  position: 'relative',
                  zIndex: 1
                }} />
              </motion.div>

              {/* Logo Text with Gradient */}
              <motion.div
                animate={{ opacity: [0.9, 1, 0.9] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                style={{ position: 'relative' }}
              >
                <h1 style={{
                  fontSize: 'clamp(3rem, 8vw, 5rem)',
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #10b981)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '0.05em',
                  margin: 0,
                  lineHeight: 1.2
                }}>
                  MindNeox.AI
                </h1>
              </motion.div>

              {/* Subtitle Badge */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                style={{
                  padding: '0.75rem 2rem',
                  borderRadius: '50px',
                  background: 'rgba(99, 102, 241, 0.1)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <p style={{ 
                  margin: 0,
                  fontSize: 'clamp(0.9rem, 2vw, 1.2rem)',
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontWeight: '500',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  fontFamily: 'monospace'
                }}>
                  The First AI Operating System
                </p>
              </motion.div>

              {/* Animated Loading Bar */}
              <motion.div
                style={{
                  width: '280px',
                  height: '4px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  position: 'relative'
                }}
              >
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: 'easeInOut',
                    repeatDelay: 0.5
                  }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.8), rgba(16, 185, 129, 0.8), transparent)',
                    width: '50%'
                  }}
                />
              </motion.div>

              {/* Loading Text */}
              <motion.p
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  margin: 0,
                  fontSize: 'clamp(0.8rem, 1.5vw, 1rem)',
                  color: 'rgba(255, 255, 255, 0.5)',
                  fontFamily: 'monospace',
                  letterSpacing: '0.2em'
                }}
              >
                INITIALIZING...
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  )
}
