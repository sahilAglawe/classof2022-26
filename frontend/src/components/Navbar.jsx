import { useState, useEffect } from 'react'

export default function Navbar({ currentPage, onNavClick, onSignIn, onLogoClick, user, onLogout, isAdmin }) {
  const [scrolled, setScrolled] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

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

          {/* User section — Sign In or Profile */}
          {user ? (
            <div className="relative ml-4">
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
                        onNavClick('yearbook')
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-stone-300 hover:bg-stone-800 hover:text-gold-500 transition-colors cursor-pointer"
                    >
                      📖 My Yearbook
                    </button>
                    <button
                      onClick={() => {
                        setShowUserMenu(false)
                        onNavClick('media')
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
              className="ml-4 px-5 py-2 border border-stone-500 text-stone-200 text-sm font-semibold tracking-widest rounded-sm hover:border-gold-500 hover:text-gold-500 transition-all duration-300 cursor-pointer"
            >
              SIGN IN
            </button>
          )}
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

          {user ? (
            <>
              <div className="flex items-center gap-3 py-2 border-t border-stone-800 mt-2 pt-4">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: '#2d2a24', color: 'var(--color-gold-500)' }}
                >
                  {getInitials(user.name)}
                </div>
                <span className="text-stone-200 text-sm font-medium">{user.name}</span>
              </div>
              <button
                onClick={() => {
                  onLogout()
                  document.getElementById('mobile-menu').classList.add('hidden')
                }}
                className="block w-full text-left text-sm text-red-400 py-2 hover:text-red-300 transition-colors"
              >
                Sign Out
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                onSignIn()
                document.getElementById('mobile-menu').classList.add('hidden')
              }}
              className="block w-full text-left text-sm font-semibold tracking-widest text-stone-200 py-2 hover:text-gold-500 transition-colors"
            >
              SIGN IN
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}
