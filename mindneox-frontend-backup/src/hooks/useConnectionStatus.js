import { useState, useEffect } from 'react'

export default function useConnectionStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    // Check if page was just refreshed
    const wasRefreshed = sessionStorage.getItem('pageRefreshed')
    if (!wasRefreshed) {
      setIsRefreshing(true)
      sessionStorage.setItem('pageRefreshed', 'true')
      
      // Show refresh loader for 1.5 seconds
      const timer = setTimeout(() => {
        setIsRefreshing(false)
      }, 1500)
      
      return () => clearTimeout(timer)
    }

    // Listen for online/offline events
    const handleOnline = () => {
      setIsOnline(true)
    }

    const handleOffline = () => {
      setIsOnline(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return { isOnline, isRefreshing }
}
