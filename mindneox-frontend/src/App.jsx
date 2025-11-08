import { Routes, Route, useLocation } from 'react-router-dom'
import { useState, Suspense, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import ChatbotPage from './pages/ChatbotPage'
import AIAgentPage from './pages/AIAgentPage'
import MarketplacePage from './pages/MarketplacePage'
import DashboardPage from './pages/DashboardPage'
import ProfilePageNew from './pages/ProfilePageNew'
import SplashScreen from './components/SplashScreen'
import NetworkStatus from './components/NetworkStatus'
import LoadingSpinner from './components/LoadingSpinner'
import PageLoader from './components/PageLoader'
import TransitionOverlay from './components/TransitionOverlay'

function App() {
  const [showSplash, setShowSplash] = useState(true) // Always show on load for testing
  const [isRefreshing, setIsRefreshing] = useState(false)
  const location = useLocation()

  const handleSplashComplete = () => {
    sessionStorage.setItem('hasSeenSplash', 'true')
    setShowSplash(false)
  }

  // Detect page refresh and show loading animation
  useEffect(() => {
    // Check if page was refreshed
    const navigationEntries = performance.getEntriesByType('navigation')
    if (navigationEntries.length > 0) {
      const navEntry = navigationEntries[0]
      if (navEntry.type === 'reload') {
        setIsRefreshing(true)
        const timer = setTimeout(() => setIsRefreshing(false), 1000)
        return () => clearTimeout(timer)
      }
    }
  }, [])

  // Show splash screen first
  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />
  }

  // Show refresh loader
  if (isRefreshing) {
    return <PageLoader />
  }

  // Show main app with smooth transitions
  return (
    <>
      <NetworkStatus />
      <TransitionOverlay />
      <Suspense fallback={<LoadingSpinner fullScreen />}>
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="chatbot" element={<ChatbotPage />} />
              <Route path="ai-agent" element={<AIAgentPage />} />
              <Route path="marketplace" element={<MarketplacePage />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="profile" element={<ProfilePageNew />} />
            </Route>
          </Routes>
        </AnimatePresence>
      </Suspense>
    </>
  )
}

export default App
