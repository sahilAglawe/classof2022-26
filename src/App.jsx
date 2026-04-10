import { useState } from 'react'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import Timeline from './components/Timeline'
import Yearbook from './components/Yearbook'
import MediaVault from './components/MediaVault'
import TheWall from './components/TheWall'
import Footer from './components/Footer'
import SignInModal from './components/SignInModal'

function App() {
  const [currentPage, setCurrentPage] = useState('journey')
  const [showSignIn, setShowSignIn] = useState(false)
  const [showHero, setShowHero] = useState(true)

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

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100">
      {/* Hide navbar on hero landing page */}
      {!(showHero && currentPage === 'journey') && (
        <Navbar
          currentPage={currentPage}
          onNavClick={handleNavClick}
          onSignIn={() => setShowSignIn(true)}
          onLogoClick={handleLogoClick}
        />
      )}

      {showHero && currentPage === 'journey' ? (
        <HeroSection onStart={handleStartJourney} onSignIn={() => setShowSignIn(true)} />
      ) : (
        <main className="pt-20">
          {currentPage === 'journey' && <Timeline />}
          {currentPage === 'yearbook' && <Yearbook />}
          {currentPage === 'media' && <MediaVault />}
          {currentPage === 'wall' && <TheWall />}
        </main>
      )}

      {/* Hide footer on hero landing page */}
      {!(showHero && currentPage === 'journey') && (
        <Footer onNavClick={handleNavClick} />
      )}

      {showSignIn && <SignInModal onClose={() => setShowSignIn(false)} />}

      {/* Film grain overlay */}
      <div className="bg-grain"></div>
    </div>
  )
}

export default App
