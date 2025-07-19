import { useState, useEffect } from 'react'
import { blink } from './blink/client'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import CreatorOnboarding from './pages/CreatorOnboarding'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState('landing')
  const [hasProfile, setHasProfile] = useState(false)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
      
      if (state.user) {
        checkUserProfile(state.user.id)
      }
    })
    return unsubscribe
  }, [])

  const checkUserProfile = async (userId: string) => {
    try {
      const profiles = await blink.db.creatorProfiles.list({
        where: { userId },
        limit: 1
      })
      
      if (profiles.length > 0) {
        setHasProfile(true)
        setCurrentPage('dashboard')
      } else {
        setCurrentPage('onboarding')
      }
    } catch (error) {
      console.error('Error checking profile:', error)
      setCurrentPage('onboarding')
    }
  }

  const handleProfileComplete = () => {
    setHasProfile(true)
    setCurrentPage('dashboard')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return <LandingPage />
  }

  if (currentPage === 'onboarding') {
    return <CreatorOnboarding onComplete={handleProfileComplete} />
  }

  return <Dashboard user={user} />
}

export default App