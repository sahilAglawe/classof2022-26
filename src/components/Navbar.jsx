import { useState, useEffect } from 'react'

export default function Navbar({ currentPage, onNavClick, onSignIn, onLogoClick }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { id: 'journey', label: 'The Journey' },
    { id: 'yearbook', label: 'Yearbook' },
    { id: 'media', label: 'Media Vault' },
    { id: 'wall', label: 'The Wall' },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-stone-950/90 backdrop-blur-md shadow-lg shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={onLogoClick}
          className="flex items-center gap-2 group cursor-pointer"
        >
          <span className="w-9 h-9 flex items-center justify-center rounded-full border-2 border-transparent group-hover:border-gold-500 group-hover:bg-gold-500/10 transition-all duration-300 text-lg">
            🎓
          </span>
          <span
            className="text-xl font-bold tracking-wide text-stone-100 group-hover:text-gold-500 transition-colors"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Batch '26
          </span>
        </button>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
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

          <button
            onClick={onSignIn}
            className="ml-4 px-5 py-2 border border-stone-500 text-stone-200 text-sm font-semibold tracking-widest rounded-sm hover:border-gold-500 hover:text-gold-500 transition-all duration-300 cursor-pointer"
          >
            SIGN IN
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-stone-300 hover:text-gold-500 transition-colors"
          onClick={() => {
            const menu = document.getElementById('mobile-menu')
            menu.classList.toggle('hidden')
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      <div id="mobile-menu" className="hidden md:hidden bg-stone-950/95 backdrop-blur-md border-t border-stone-800">
        <div className="px-6 py-4 space-y-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavClick(item.id)
                document.getElementById('mobile-menu').classList.add('hidden')
              }}
              className={`block w-full text-left text-sm font-medium tracking-wide py-2 transition-colors ${
                currentPage === item.id ? 'text-gold-500' : 'text-stone-300 hover:text-gold-500'
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => {
              onSignIn()
              document.getElementById('mobile-menu').classList.add('hidden')
            }}
            className="block w-full text-left text-sm font-semibold tracking-widest text-stone-200 py-2 hover:text-gold-500 transition-colors"
          >
            SIGN IN
          </button>
        </div>
      </div>
    </nav>
  )
}
