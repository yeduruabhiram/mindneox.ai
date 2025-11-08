import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Brain, 
  MessageSquare, 
  Bot, 
  Store, 
  LayoutDashboard, 
  Menu, 
  X,
  Sparkles,
  User,
  LogOut,
  Settings
} from 'lucide-react'
import { SignInButton, SignUpButton, UserButton, useUser, SignedIn, SignedOut, useClerk } from '@clerk/clerk-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [lastActivity, setLastActivity] = useState(Date.now())
  const location = useLocation()
  const { user, isLoaded } = useUser()
  const { signOut } = useClerk()

  // Track user activity
  const handleActivity = () => {
    setLastActivity(Date.now())
    setIsVisible(true)
  }

  // Check for inactivity
  useEffect(() => {
    const inactivityTimeout = 3000 // 3 seconds of inactivity before hiding
    
    const checkActivity = () => {
      if (Date.now() - lastActivity > inactivityTimeout && !isOpen) {
        setIsVisible(false)
      }
    }

    const interval = setInterval(checkActivity, 1000)
    
    // Add event listeners for user activity
    window.addEventListener('mousemove', handleActivity)
    window.addEventListener('click', handleActivity)
    window.addEventListener('touchstart', handleActivity)
    window.addEventListener('keydown', handleActivity)
    window.addEventListener('scroll', handleActivity)

    return () => {
      clearInterval(interval)
      window.removeEventListener('mousemove', handleActivity)
      window.removeEventListener('click', handleActivity)
      window.removeEventListener('touchstart', handleActivity)
      window.removeEventListener('keydown', handleActivity)
      window.removeEventListener('scroll', handleActivity)
    }
  }, [lastActivity, isOpen])

  const navItems = [
    { name: 'Home', path: '/', icon: Sparkles },
    { name: 'Chatbot', path: '/chatbot', icon: MessageSquare },
    { name: 'AI Agent', path: '/ai-agent', icon: Bot },
    { name: 'Marketplace', path: '/marketplace', icon: Store },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Profile', path: '/profile', icon: User },
  ]

  const isActive = (path) => location.pathname === path

  // Swipe gesture handlers
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    // Swipe from left edge to open
    if (isRightSwipe && touchStart < 50) {
      setIsOpen(true)
    }
    // Swipe right to close
    if (isLeftSwipe && isOpen) {
      setIsOpen(false)
    }

    setTouchStart(0)
    setTouchEnd(0)
  }

  // Close sidebar on route change
  useEffect(() => {
    setIsOpen(false)
  }, [location])

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <>
      {/* Touch swipe detection layer */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="fixed inset-0 z-0 pointer-events-none md:hidden"
      />

      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ 
          y: isVisible ? 0 : -100,
          opacity: isVisible ? 1 : 0
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
      >
        <div className="glass-card max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Brain className="w-8 h-8 text-neon-cyan group-hover:text-neon-magenta transition-colors duration-300" />
              <div className="absolute inset-0 blur-xl bg-neon-cyan/50 group-hover:bg-neon-magenta/50 transition-colors duration-300" />
            </div>
            <span className="text-xl font-space font-bold gradient-text">
              MindNeox.AI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    isActive(item.path)
                      ? 'text-neon-cyan'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{item.name}</span>
                  {isActive(item.path) && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 bg-white/10 rounded-lg border border-neon-cyan/50"
                    />
                  )}
                </Link>
              )
            })}
          </div>

          {/* User Button - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            <SignedIn>
              <div className="flex items-center gap-3">
                {isLoaded && user && (
                  <span className="text-sm text-white/70">
                    Hey, <span className="text-neon-cyan font-medium">{user.firstName || user.username}</span>
                  </span>
                )}
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10 ring-2 ring-neon-cyan/50 hover:ring-neon-cyan transition-all"
                    }
                  }}
                />
              </div>
            </SignedIn>
            <SignedOut>
              {location.pathname === '/chatbot' && (
                <div className="flex items-center gap-3">
                  <SignInButton mode="redirect" redirectUrl="/chatbot">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="glass-card px-4 py-2 rounded-lg border border-neon-cyan/30 hover:border-neon-cyan/50 hover:bg-neon-cyan/10 text-white/90 hover:text-white transition-all flex items-center gap-2"
                    >
                      <User className="w-4 h-4" />
                      Sign In
                    </motion.button>
                  </SignInButton>
                  <SignUpButton mode="redirect" redirectUrl="/chatbot">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="glass-card px-4 py-2 rounded-lg bg-gradient-to-r from-neon-cyan/80 to-neon-magenta/80 text-white font-medium hover:brightness-110 transition-all flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      Sign Up
                    </motion.button>
                  </SignUpButton>
                </div>
              )}
            </SignedOut>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Sidebar Drawer - ChatGPT Style */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
            />

            {/* Side Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ 
                type: 'spring', 
                damping: 30, 
                stiffness: 300,
                mass: 0.8
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              onDragEnd={(e, { offset, velocity }) => {
                // Close on left swipe
                if (offset.x < -100 || velocity.x < -500) {
                  setIsOpen(false)
                }
              }}
              className="fixed left-0 top-0 h-full w-80 max-w-[85vw] glass-card border-r border-neon-cyan/20 z-50 overflow-y-auto md:hidden shadow-2xl"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <Link 
                    to="/" 
                    className="flex items-center gap-2 group" 
                    onClick={() => setIsOpen(false)}
                  >
                    <Brain className="w-7 h-7 text-neon-cyan" />
                    <span className="text-lg font-space font-bold gradient-text">
                      MindNeox.AI
                    </span>
                  </Link>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>

                {/* User Info in Sidebar */}
                <SignedIn>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                    <UserButton 
                      appearance={{
                        elements: {
                          avatarBox: "w-10 h-10 ring-2 ring-neon-cyan/50"
                        }
                      }}
                    />
                    {isLoaded && user && (
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {user.fullName || user.username || 'User'}
                        </p>
                        <p className="text-xs text-white/50 truncate">
                          {user.primaryEmailAddress?.emailAddress}
                        </p>
                      </div>
                    )}
                  </div>
                </SignedIn>
              </div>

              {/* Navigation Links */}
              <div className="p-4 space-y-2">
                <div className="text-xs font-semibold text-white/40 uppercase tracking-wider px-3 mb-3">
                  Navigation
                </div>
                {navItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all active:scale-95 ${
                        isActive(item.path)
                          ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/50 shadow-lg shadow-neon-cyan/20'
                          : 'text-white/70 hover:bg-white/10 hover:text-white active:bg-white/20'
                      }`}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  )
                })}
              </div>

              {/* Drawer Footer - User Info */}
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 bg-dark-900/95 backdrop-blur-lg">
                <SignedIn>
                  <button
                    onClick={() => {
                      signOut()
                      setIsOpen(false)
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-all active:scale-95"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Sign Out</span>
                  </button>
                </SignedIn>
                <SignedOut>
                  {location.pathname === '/chatbot' ? (
                    <div className="space-y-3">
                      <SignInButton mode="redirect" redirectUrl="/chatbot">
                        <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-neon-cyan/10 text-neon-cyan hover:bg-neon-cyan/20 border border-neon-cyan/30 transition-all active:scale-95 group">
                          <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
                          <span className="font-medium">Sign In</span>
                        </button>
                      </SignInButton>
                      <SignUpButton mode="redirect" redirectUrl="/chatbot">
                        <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-neon-cyan/80 to-neon-magenta/80 text-white font-medium hover:brightness-110 transition-all active:scale-95 group">
                          <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                          <span className="font-medium">Create Account</span>
                        </button>
                      </SignUpButton>
                    </div>
                  ) : (
                    <div className="py-3 text-center text-white/50 text-sm">
                      Navigation Menu
                    </div>
                  )}
                </SignedOut>
              </div>

              {/* Drag Indicator */}
              <div className="absolute top-1/2 -right-1 transform -translate-y-1/2 pointer-events-none">
                <div className="w-1 h-16 bg-gradient-to-b from-transparent via-neon-cyan/30 to-transparent rounded-l-full" />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
