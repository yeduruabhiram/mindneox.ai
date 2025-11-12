import { Outlet, useLocation } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import Navbar from './Navbar'
import ParticleBackground from './ParticleBackground'
import PageTransition from './PageTransition'

export default function Layout() {
  const location = useLocation()
  const mainRef = useRef(null)

  // Prevent scroll jumping on route change
  useEffect(() => {
    // Store current scroll position before route change
    const scrollY = window.scrollY

    // Reset scroll immediately to prevent jump
    if (scrollY > 0) {
      window.scrollTo(0, 0)
    }

    // Ensure smooth transition
    if (mainRef.current) {
      mainRef.current.scrollTop = 0
    }
  }, [location.pathname])

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 overflow-x-hidden">
      <ParticleBackground />
      
      {/* Glass overlay effect */}
      <div className="fixed inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-white/[0.02] pointer-events-none z-0" />
      
      <Navbar />
      <main 
        ref={mainRef}
        className="relative z-10"
        style={{ 
          minHeight: '100vh',
          position: 'relative'
        }}
      >
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
    </div>
  )
}
