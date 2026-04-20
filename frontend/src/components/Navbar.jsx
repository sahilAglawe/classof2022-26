import { useState, useEffect } from 'react'

export default function Navbar({ currentPage, onNavClick, onSignIn, onLogoClick, user, onLogout, isAdmin, onMyContent }) {
  const [scrolled, setScrolled] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClick = () => setShowUserMenu(false)
    if (showUserMenu) {
      document.addEventListener('click', handleClick)
      return () => document.removeEventListener('click', handleClick)
    }
  }, [showUserMenu])

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

  // Get initials from name (e.g., "Sahil Aglawe" → "SA")
  const getInitials = (name) => {
    if (!name) return '?'
    return name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

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

          {/* User section — Sign In or Profile */}
          {user ? (
            <div className="relative ml-2 lg:ml-4">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowUserMenu(!showUserMenu)
                }}
                className="flex items-center gap-2 cursor-pointer group"
              >
                {/* Avatar */}
                {user.profilePic ? (
                  <img
                    src={user.profilePic}
                    alt={user.name}
                    className="w-9 h-9 rounded-full object-cover border-2 border-stone-600 group-hover:border-gold-500 transition-colors"
                  />
                ) : (
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border-2 border-stone-600 group-hover:border-gold-500 transition-colors"
                    style={{ background: '#2d2a24', color: 'var(--color-gold-500)' }}
                  >
                    {getInitials(user.name)}
                  </div>
                )}
                <span className="text-sm text-stone-300 group-hover:text-gold-500 transition-colors hidden lg:block">
                  {user.name.split(' ')[0]}
                </span>
                <svg className="w-3 h-3 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown menu */}
              {showUserMenu && (
                <div
                  className="absolute right-0 top-12 w-64 rounded-xl shadow-2xl border border-stone-700 overflow-hidden z-50"
                  style={{ background: '#1c1a17' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* User info */}
                  <div className="px-4 py-4 border-b border-stone-800">
                    <div className="flex items-center gap-3">
                      {user.profilePic ? (
                        <img src={user.profilePic} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                          style={{ background: '#2d2a24', color: 'var(--color-gold-500)' }}
                        >
                          {getInitials(user.name)}
                        </div>
                      )}
                      <div>
                        <p className="text-stone-100 text-sm font-semibold">{user.name}</p>
                        <p className="text-stone-500 text-xs">{user.email}</p>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gold-500/10 text-gold-500 border border-gold-500/30">
                        {user.branch}
                      </span>
                      {user.rollNo && (
                        <span className="text-xs text-stone-500 font-mono">{user.rollNo}</span>
                      )}
                    </div>
                  </div>

                  {/* Menu items */}
                  <div className="py-2">
                    <button
                      onClick={() => {
                        setShowUserMenu(false)
                        if (onMyContent) onMyContent('yearbook')
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-stone-300 hover:bg-stone-800 hover:text-gold-500 transition-colors cursor-pointer"
                    >
                      📖 My Yearbook
                    </button>
                    <button
                      onClick={() => {
                        setShowUserMenu(false)
                        if (onMyContent) onMyContent('media')
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-stone-300 hover:bg-stone-800 hover:text-gold-500 transition-colors cursor-pointer"
                    >
                      📸 My Uploads
                    </button>
                  </div>

                  {/* Admin link */}
                  {isAdmin && (
                    <div className="border-t border-stone-800 py-2">
                      <button
                        onClick={() => {
                          setShowUserMenu(false)
                          onNavClick('admin')
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-gold-500 hover:bg-stone-800 transition-colors cursor-pointer font-medium"
                      >
                        🛡️ Admin Dashboard
                      </button>
                    </div>
                  )}

                  {/* Logout */}
                  <div className="border-t border-stone-800 py-2">
                    <button
                      onClick={() => {
                        setShowUserMenu(false)
                        onLogout()
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-stone-800 transition-colors cursor-pointer"
                    >
                      🚪 Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onSignIn}
              className="ml-2 lg:ml-4 px-4 lg:px-5 py-2 border border-stone-500 text-stone-200 text-sm font-semibold tracking-widest rounded-sm hover:border-gold-500 hover:text-gold-500 transition-all duration-300 cursor-pointer"
            >
              SIGN IN
            </button>
          )}
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

            {/* User-specific items */}
            {user && (
              <div className="px-3 py-2 border-t border-stone-800/60">
                <p className="px-4 py-2 text-stone-600 text-[10px] tracking-widest uppercase font-medium">My Stuff</p>
                <button
                  onClick={() => {
                    setMobileOpen(false)
                    if (onMyContent) onMyContent('media')
                  }}
                  className="block w-full text-left px-4 py-3 rounded-xl text-sm text-stone-300 hover:text-gold-500 hover:bg-stone-800/50 transition-all"
                >
                  📸 My Uploads
                </button>
                <button
                  onClick={() => {
                    setMobileOpen(false)
                    if (onMyContent) onMyContent('yearbook')
                  }}
                  className="block w-full text-left px-4 py-3 rounded-xl text-sm text-stone-300 hover:text-gold-500 hover:bg-stone-800/50 transition-all"
                >
                  📖 My Yearbook
                </button>

                {isAdmin && (
                  <button
                    onClick={() => handleMobileNav('admin')}
                    className="block w-full text-left px-4 py-3 rounded-xl text-sm text-gold-500 font-medium hover:bg-stone-800/50 transition-all"
                  >
                    🛡️ Admin Dashboard
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Bottom section — user info or sign-in */}
          <div className="px-5 py-4 border-t border-stone-800/60">
            {user ? (
              <div>
                <div className="flex items-center gap-3 mb-3">
                  {user.profilePic ? (
                    <img src={user.profilePic} alt={user.name} className="w-9 h-9 rounded-full object-cover" />
                  ) : (
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ background: '#2d2a24', color: 'var(--color-gold-500)' }}
                    >
                      {getInitials(user.name)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-stone-200 text-sm font-medium truncate">{user.name}</p>
                    <p className="text-stone-500 text-[11px] truncate">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onLogout()
                    setMobileOpen(false)
                  }}
                  className="w-full py-2.5 rounded-xl text-sm text-red-400 bg-red-500/8 border border-red-500/15 hover:bg-red-500/15 transition-all cursor-pointer font-medium"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onSignIn()
                  setMobileOpen(false)
                }}
                className="w-full py-3 rounded-xl text-sm font-semibold tracking-wide cursor-pointer transition-all hover:brightness-110"
                style={{ background: 'var(--color-gold-500)', color: '#1a1814' }}
              >
                SIGN IN
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
