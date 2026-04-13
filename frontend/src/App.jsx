import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import Timeline from './components/Timeline'
import Yearbook from './components/Yearbook'
import MediaVault from './components/MediaVault'
import TheWall from './components/TheWall'
import Footer from './components/Footer'
import SignInModal from './components/SignInModal'
import AdminDashboard from './components/AdminDashboard'
import { onAuthChange, signOutUser } from './firebase/auth'

function App() {
  const [currentPage, setCurrentPage] = useState('journey')
  const [showSignIn, setShowSignIn] = useState(false)
  const [showHero, setShowHero] = useState(true)
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthChange((profile) => {
      if (profile && profile.status === 'approved') {
        setUser(profile)
      } else {
        setUser(null)
      }
      setAuthLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const handleStartJourney = () => {
    setShowHero(false)
    setCurrentPage('journey')
  }

  const handleNavClick = (page) => {
    setShowHero(false)
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleLogoClick = () => {
    setShowHero(true)
    setCurrentPage('journey')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleLoginSuccess = (profile) => {
    setUser(profile)
  }

  const handleLogout = async () => {
    await signOutUser()
    setUser(null)
    setCurrentPage('journey')
  }

  const isAdmin = user?.role === 'admin'

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100">
      {/* Hide navbar on hero and admin pages */}
      {!(showHero && currentPage === 'journey') && currentPage !== 'admin' && (
        <Navbar
          currentPage={currentPage}
          onNavClick={handleNavClick}
          onSignIn={() => setShowSignIn(true)}
          onLogoClick={handleLogoClick}
          user={user}
          onLogout={handleLogout}
          isAdmin={isAdmin}
        />
      )}

      {showHero && currentPage === 'journey' ? (
        <HeroSection onStart={handleStartJourney} onSignIn={() => setShowSignIn(true)} user={user} />
      ) : currentPage === 'admin' && isAdmin ? (
        <AdminDashboard
          user={user}
          onBack={() => {
            setCurrentPage('journey')
            setShowHero(false)
          }}
        />
      ) : (
        <main className="pt-20">
          {currentPage === 'journey' && <Timeline />}
          {currentPage === 'yearbook' && <Yearbook user={user} />}
          {currentPage === 'media' && <MediaVault user={user} />}
          {currentPage === 'wall' && <TheWall user={user} />}
        </main>
      )}

      {/* Hide footer on hero and admin pages */}
      {!(showHero && currentPage === 'journey') && currentPage !== 'admin' && (
        <Footer onNavClick={handleNavClick} currentPage={currentPage} />
      )}

      {showSignIn && (
        <SignInModal
          onClose={() => setShowSignIn(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      <div className="bg-grain"></div>
    </div>
  )
}

export default App
