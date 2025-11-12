import { motion } from 'framer-motion'
import { Lock, Sparkles, Zap, ArrowLeft, Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { db } from '../firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

export default function ComingSoon({ pageName = "This Feature" }) {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleNotifyMe = async (e) => {
    e.preventDefault()
    
    // Validate email
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      // Store email in Firestore
      await addDoc(collection(db, 'coming_soon_emails'), {
        email: email.toLowerCase().trim(),
        pageName: pageName,
        subscribedAt: serverTimestamp(),
        notified: false,
        source: 'coming_soon_page'
      })

      setIsSuccess(true)
      setEmail('')
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSuccess(false)
      }, 5000)
    } catch (err) {
      console.error('Error saving email:', err)
      setError('Failed to save email. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-neon-cyan to-neon-magenta rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center max-w-2xl"
      >
        {/* Animated Lock Icon */}
        <motion.div
          className="relative w-32 h-32 mx-auto mb-8"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {/* Glow Effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-neon-cyan via-neon-violet to-neon-magenta rounded-full blur-3xl opacity-50"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
          />

          {/* Lock Icon */}
          <div className="relative glass-card w-full h-full flex items-center justify-center">
            <motion.div
              animate={{
                y: [0, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              <Lock className="w-16 h-16 text-neon-cyan" />
            </motion.div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-5xl md:text-7xl font-space font-bold mb-6"
        >
          <span className="gradient-text">Coming Soon</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-xl md:text-2xl text-white/70 mb-4"
        >
          {pageName} is under development
        </motion.p>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-base md:text-lg text-white/50 mb-12 max-w-lg mx-auto"
        >
          We're working hard to bring you something amazing. Stay tuned for updates!
        </motion.p>

        {/* Animated Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-12"
        >
          {[
            { icon: Sparkles, text: 'AI-Powered', color: 'from-neon-cyan to-blue-500' },
            { icon: Zap, text: 'Lightning Fast', color: 'from-neon-violet to-purple-500' },
            { icon: Lock, text: 'Secure', color: 'from-neon-magenta to-pink-500' },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 + idx * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="glass-card px-4 py-2 flex items-center gap-2"
            >
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${feature.color} p-1.5 flex items-center justify-center`}>
                <feature.icon className="w-full h-full text-white" />
              </div>
              <span className="text-white/80 text-sm font-medium">{feature.text}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Loading Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 rounded-full bg-gradient-to-r from-neon-cyan to-neon-magenta"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
          <p className="text-white/40 text-sm">Building something extraordinary...</p>
        </motion.div>

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 glass-card px-8 py-4 text-lg font-semibold text-white hover:scale-105 transition-all neon-glow-hover group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
        </motion.div>

        {/* Notify Me Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6 }}
          className="mt-12 glass-card p-6 max-w-md mx-auto"
        >
          {isSuccess ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center justify-center gap-3 py-2"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                <Check className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <p className="text-white font-semibold">You're on the list!</p>
                <p className="text-white/60 text-sm">We'll notify you when it's ready</p>
              </div>
            </motion.div>
          ) : (
            <>
              <p className="text-white/70 text-sm mb-4">
                Want to be notified when this feature launches?
              </p>
              <form onSubmit={handleNotifyMe} className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    disabled={isSubmitting}
                    className="flex-1 glass-card px-4 py-2 text-white placeholder-white/40 bg-transparent border border-white/20 rounded-lg focus:border-neon-cyan focus:outline-none transition-all disabled:opacity-50"
                    required
                  />
                  <motion.button
                    type="submit"
                    whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                    disabled={isSubmitting}
                    className="glass-card px-6 py-2 bg-gradient-to-r from-neon-cyan to-neon-violet text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      'Notify Me'
                    )}
                  </motion.button>
                </div>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-sm"
                  >
                    {error}
                  </motion.p>
                )}
              </form>
            </>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}
