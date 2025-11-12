import { motion } from 'framer-motion'
import { Wifi, WifiOff, RefreshCw, Zap } from 'lucide-react'

export default function RefreshLoader({ isOnline = true, message = 'Loading...' }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9998,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f172a, #1e293b)',
        color: '#fff'
      }}
    >
      {/* Animated Grid Background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        opacity: 0.3
      }} />

      {/* Content */}
      <div style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2rem',
        textAlign: 'center',
        padding: '2rem'
      }}>
        {/* Rotating Energy Ring */}
        <div style={{ position: 'relative' }}>
          {/* Outer Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              border: '3px solid transparent',
              borderTopColor: isOnline ? '#6366f1' : '#ef4444',
              borderRightColor: isOnline ? '#8b5cf6' : '#f97316',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          />

          {/* Inner Ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            style={{
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              border: '2px solid transparent',
              borderTopColor: isOnline ? '#10b981' : '#dc2626',
              borderLeftColor: isOnline ? '#06b6d4' : '#ea580c',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          />

          {/* Center Icon */}
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: isOnline ? [0, 5, -5, 0] : 0
            }}
            transition={{ 
              scale: { duration: 2, repeat: Infinity },
              rotate: { duration: 3, repeat: Infinity }
            }}
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: isOnline 
                ? 'radial-gradient(circle, rgba(99, 102, 241, 0.2), transparent)'
                : 'radial-gradient(circle, rgba(239, 68, 68, 0.2), transparent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: isOnline
                ? '0 0 30px rgba(99, 102, 241, 0.3)'
                : '0 0 30px rgba(239, 68, 68, 0.3)'
            }}
          >
            {isOnline ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <RefreshCw size={40} color="#6366f1" style={{ 
                  filter: 'drop-shadow(0 0 10px rgba(99, 102, 241, 0.8))' 
                }} />
              </motion.div>
            ) : (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <WifiOff size={40} color="#ef4444" style={{ 
                  filter: 'drop-shadow(0 0 10px rgba(239, 68, 68, 0.8))' 
                }} />
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Message */}
        <motion.div
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}
        >
          <h2 style={{
            fontSize: 'clamp(1.5rem, 4vw, 2rem)',
            fontWeight: '700',
            background: isOnline
              ? 'linear-gradient(135deg, #6366f1, #8b5cf6, #10b981)'
              : 'linear-gradient(135deg, #ef4444, #f97316, #dc2626)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0
          }}>
            {isOnline ? 'Loading' : 'Connection Lost'}
          </h2>
          
          <p style={{
            fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
            color: 'rgba(255, 255, 255, 0.6)',
            margin: 0,
            fontFamily: 'monospace',
            letterSpacing: '0.1em'
          }}>
            {message}
          </p>
        </motion.div>

        {/* Animated Dots */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          alignItems: 'center'
        }}>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ 
                y: [0, -10, 0],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                delay: i * 0.2 
              }}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: isOnline
                  ? 'linear-gradient(135deg, #6366f1, #10b981)'
                  : 'linear-gradient(135deg, #ef4444, #f97316)'
              }}
            />
          ))}
        </div>

        {/* Status Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            padding: '0.5rem 1.5rem',
            borderRadius: '50px',
            background: isOnline
              ? 'rgba(99, 102, 241, 0.1)'
              : 'rgba(239, 68, 68, 0.1)',
            border: isOnline
              ? '1px solid rgba(99, 102, 241, 0.3)'
              : '1px solid rgba(239, 68, 68, 0.3)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          {isOnline ? (
            <>
              <Wifi size={16} color="#10b981" />
              <span style={{
                fontSize: '0.85rem',
                color: 'rgba(255, 255, 255, 0.7)',
                fontFamily: 'monospace',
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}>
                Connected
              </span>
            </>
          ) : (
            <>
              <WifiOff size={16} color="#ef4444" />
              <span style={{
                fontSize: '0.85rem',
                color: 'rgba(255, 255, 255, 0.7)',
                fontFamily: 'monospace',
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}>
                Offline
              </span>
            </>
          )}
        </motion.div>

        {/* Retry Button (only when offline) */}
        {!isOnline && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()}
            style={{
              marginTop: '1rem',
              padding: '0.75rem 2rem',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              border: 'none',
              color: '#fff',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 20px rgba(99, 102, 241, 0.3)'
            }}
          >
            <RefreshCw size={18} />
            Retry Connection
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}
