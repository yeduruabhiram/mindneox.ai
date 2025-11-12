import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SignInButton } from '@clerk/clerk-react';
import { Lock, X } from 'lucide-react';

export default function LoginPrompt({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative max-w-md w-full mx-4"
          onClick={e => e.stopPropagation()}
        >
          {/* Card */}
          <div className="relative">
            {/* Glow Effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-cyan via-neon-magenta to-neon-violet opacity-75 blur-lg" />
            
            {/* Content */}
            <div className="relative glass-card p-6 border border-white/20">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute right-4 top-4 p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-white/70" />
              </button>

              {/* Icon */}
              <div className="mb-6 flex justify-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-neon-cyan/20 to-neon-magenta/20 flex items-center justify-center border border-white/20">
                  <Lock className="w-8 h-8 text-neon-cyan" />
                </div>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-center mb-3">
                Continue the Conversation
              </h2>

              {/* Message */}
              <p className="text-white/70 text-center mb-6">
                You've reached the limit of 5 free conversations. Sign in to continue chatting with unlimited access to MindNeox.AI
              </p>

              {/* Sign In Button */}
              <SignInButton mode="redirect" redirectUrl="/chatbot">
                <button className="w-full glass-card px-6 py-3 rounded-lg bg-gradient-to-r from-neon-cyan via-neon-magenta to-neon-violet text-white font-medium hover:brightness-110 transition-all group">
                  <span className="flex items-center justify-center gap-2">
                    <Lock className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    Sign in to Continue
                  </span>
                </button>
              </SignInButton>

              {/* Skip Option */}
              <button
                onClick={onClose}
                className="mt-4 w-full text-sm text-white/50 hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                Maybe Later
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}