import { useState, useEffect } from 'react'

export default function Navbar({ currentPage, onNavClick, onLogoClick }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const navItems = [
    { id: 'journey', label: 'The Journey' },
    { id: 'yearbook', label: 'Yearbook' },
    { id: 'media', label: 'Media Vault' },
    { id: 'wall', label: 'The Wall' },
  ]

  const handleMobileNav = (page) => {
    onNavClick(page)
    setMobileOpen(false)
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-stone-950/90 backdrop-blur-md shadow-lg shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={onLogoClick}
          className="flex items-center gap-2 group cursor-pointer"
        >
          <span className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full border-2 border-transparent group-hover:border-gold-500 group-hover:bg-gold-500/10 transition-all duration-300 text-base sm:text-lg">
            🎓
          </span>
          <span
            className="text-lg sm:text-xl font-bold tracking-wide text-stone-100 group-hover:text-gold-500 transition-colors"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Batch '26
          </span>
        </button>

        {/* Navigation Links — Desktop */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavClick(item.id)}
              className={`relative text-sm font-medium tracking-wide transition-colors duration-300 cursor-pointer ${
                currentPage === item.id
                  ? 'text-gold-500'
                  : 'text-stone-300 hover:text-gold-500'
              }`}
            >
              {item.label}
              {currentPage === item.id && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gold-500 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-stone-300 hover:text-gold-500 transition-colors p-1"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu — full screen overlay */}
      <div
        className={`md:hidden fixed inset-0 top-0 z-50 transition-all duration-300 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />

        {/* Menu panel — slides from right */}
        <div
          className={`absolute top-0 right-0 h-full w-72 sm:w-80 bg-stone-950 border-l border-stone-800 shadow-2xl transition-transform duration-300 ease-out flex flex-col ${
            mobileOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Close button */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-stone-800/60">
            <span
              className="text-lg font-bold text-stone-100"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Menu
            </span>
            <button
              onClick={() => setMobileOpen(false)}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-stone-800/60 text-stone-400 hover:text-stone-200 transition-colors cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Nav items */}
          <div className="flex-1 overflow-y-auto no-scrollbar">
            <div className="px-3 py-4 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleMobileNav(item.id)}
                  className={`block w-full text-left px-4 py-3.5 rounded-xl text-sm font-medium tracking-wide transition-all ${
                    currentPage === item.id
                      ? 'text-gold-500 bg-gold-500/10'
                      : 'text-stone-300 hover:text-gold-500 hover:bg-stone-800/50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
