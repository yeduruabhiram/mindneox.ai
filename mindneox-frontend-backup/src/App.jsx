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
import ReportPage from './pages/ReportPage'
import SplashScreen from './components/SplashScreen'
import NetworkStatus from './components/NetworkStatus'
import LoadingSpinner from './components/LoadingSpinner'
import PageLoader from './components/PageLoader'
import TransitionOverlay from './components/TransitionOverlay'
import RefreshLoader from './components/RefreshLoader'
import useConnectionStatus from './hooks/useConnectionStatus'

function App() {
  const [showSplash, setShowSplash] = useState(true) // Always show on load for testing
  const { isOnline, isRefreshing } = useConnectionStatus()
  const location = useLocation()

  const handleSplashComplete = () => {
    sessionStorage.setItem('hasSeenSplash', 'true')
    setShowSplash(false)
  }

  // Show splash screen first
  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />
  }

  // Show refresh loader when page is refreshed
  if (isRefreshing) {
    return <RefreshLoader isOnline={isOnline} message="Refreshing MindNeox.AI..." />
  }

  // Show offline screen when connection is lost
  if (!isOnline) {
    return <RefreshLoader isOnline={false} message="Please check your internet connection" />
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
              <Route path="report" element={<ReportPage />} />
            </Route>
          </Routes>
        </AnimatePresence>
      </Suspense>
    </>
  )
}

export default App
