import { motion, AnimatePresence } from 'framer-motion'
import { SignInButton, SignUpButton } from '@clerk/clerk-react'
import { Brain } from 'lucide-react'

export default function AuthPrompt({ onClose }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-lg"
        >
          {/* Auth Card */}
          <div className="glass-card relative overflow-hidden bg-gradient-to-br from-dark-800 to-dark-900 border border-neon-cyan/30">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <svg className="w-5 h-5 text-white/70" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Content */}
            <div className="p-8 flex flex-col items-center text-center">
              {/* Logo */}
              <div className="relative mb-6">
                <Brain className="w-16 h-16 text-neon-cyan" />
                <div className="absolute inset-0 blur-2xl bg-neon-cyan/30" />
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold mb-3 gradient-text">
                Continue the Conversation
              </h2>

              {/* Description */}
              <p className="text-white/70 mb-8">
                Sign up to unlock unlimited AI conversations and keep your chat history.
              </p>

              {/* Auth Buttons */}
              <div className="space-y-3 w-full max-w-sm">
                <SignUpButton mode="modal">
                  <button className="w-full glass-card px-6 py-3 text-base font-bold gradient-text hover:scale-105 transition-transform neon-glow-hover border border-neon-cyan/30">
                    Create Free Account
                  </button>
                </SignUpButton>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-4 text-sm text-white/40 bg-dark-900">or</span>
                  </div>
                </div>

                <SignInButton mode="modal">
                  <button className="w-full px-6 py-3 text-base font-semibold text-white hover:text-neon-cyan transition-all hover:scale-105 border border-white/20 hover:border-neon-cyan/50 rounded-lg backdrop-blur-sm">
                    Sign In
                  </button>
                </SignInButton>
              </div>

              {/* Skip Link */}
              <button 
                onClick={onClose}
                className="mt-6 text-sm text-white/40 hover:text-white/60 transition-colors"
              >
                Continue as Guest
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}