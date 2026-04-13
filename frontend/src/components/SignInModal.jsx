import { useState } from 'react'
import { registerUser, signInUser } from '../firebase/auth'

export default function SignInModal({ onClose, onLoginSuccess }) {
  const [mode, setMode] = useState('signin') // 'signin' or 'register'
  const [loading, setLoading] = useState(false)

  // Sign In state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Register state
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regRoll, setRegRoll] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regError, setRegError] = useState('')
  const [signInError, setSignInError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const handleSignIn = async (e) => {
    e.preventDefault()
    setSignInError('')
    if (!email.trim() || !password.trim()) {
      setSignInError('Please fill in all fields.')
      return
    }

    setLoading(true)
    try {
      const userProfile = await signInUser(email, password)
      onLoginSuccess(userProfile)
      onClose()
    } catch (err) {
      setSignInError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setRegError('')
    setSuccessMsg('')

    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setRegError('Name, Email, and Password are mandatory.')
      return
    }

    // Validate roll number range
    if (regRoll.trim()) {
      const rollNum = parseInt(regRoll, 10)
      if (
        isNaN(rollNum) ||
        rollNum < 2241881242001 ||
        rollNum > 2241881242080
      ) {
        setRegError('Roll number must be between 2241881242001 and 2241881242080.')
        return
      }
    }

    setLoading(true)
    try {
      const result = await registerUser({
        name: regName,
        email: regEmail,
        branch: 'CSE',
        rollNo: regRoll,
        password: regPassword,
      })
      setSuccessMsg(result.message)
      // Clear form
      setRegName('')
      setRegEmail('')
      setRegRoll('')
      setRegPassword('')
    } catch (err) {
      setRegError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const switchMode = () => {
    setMode(mode === 'signin' ? 'register' : 'signin')
    setRegError('')
    setSignInError('')
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg mx-4 relative"
        style={{
          background: 'linear-gradient(145deg, #1c1a17, #1a1814)',
          border: '1px solid rgba(196, 164, 75, 0.3)',
          borderRadius: '1rem',
          padding: '2.5rem',
          boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 40px rgba(196,164,75,0.05)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-500 hover:text-stone-300 transition-colors cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>

        {mode === 'signin' ? (
          /* =================== SIGN IN =================== */
          <>
            {/* Header */}
            <div className="text-center mb-8">
              <h2
                className="text-3xl md:text-4xl mb-2"
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontStyle: 'italic',
                  fontWeight: 400,
                  color: 'var(--color-gold-500)',
                }}
              >
                Welcome Back
              </h2>
              <p className="text-stone-400 text-sm">Sign in to access your digital yearbook</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSignIn} className="space-y-5">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                required
                className="w-full px-5 py-4 rounded-lg text-stone-100 placeholder-stone-500 focus:outline-none transition-all"
                style={{
                  background: '#1a1814',
                  border: '1px solid #3d3930',
                  fontSize: '0.95rem',
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--color-gold-500)'}
                onBlur={(e) => e.target.style.borderColor = '#3d3930'}
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full px-5 py-4 rounded-lg text-stone-100 placeholder-stone-500 focus:outline-none transition-all"
                style={{
                  background: '#1a1814',
                  border: '1px solid #3d3930',
                  fontSize: '0.95rem',
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--color-gold-500)'}
                onBlur={(e) => e.target.style.borderColor = '#3d3930'}
              />

              {signInError && (
                <p className="text-red-400 text-sm text-center">{signInError}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-lg font-semibold text-base tracking-wide transition-all duration-300 cursor-pointer hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: 'var(--color-gold-500)',
                  color: '#1a1814',
                }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            {/* Divider + Switch */}
            <div className="mt-8 pt-5" style={{ borderTop: '1px solid #2d2a24' }}>
              <p className="text-center text-stone-500 text-sm">
                Don't have an account?{' '}
                <button
                  onClick={switchMode}
                  className="font-semibold hover:underline cursor-pointer"
                  style={{ color: 'var(--color-gold-500)' }}
                >
                  Create one
                </button>
              </p>
            </div>
          </>
        ) : (
          /* =================== REGISTER =================== */
          <>
            {/* Header */}
            <div className="text-center mb-8">
              <h2
                className="text-3xl md:text-4xl mb-2"
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontStyle: 'italic',
                  fontWeight: 400,
                  color: 'var(--color-gold-500)',
                }}
              >
                Request Access
              </h2>
              <p className="text-stone-400 text-sm">Request access to join the digital archive</p>
            </div>

            {/* Form */}
            <form onSubmit={handleRegister} className="space-y-4">
              {/* Row 1: Name + Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Full Name *"
                  required
                  className="w-full px-5 py-4 rounded-lg text-stone-100 placeholder-stone-500 focus:outline-none transition-all"
                  style={{
                    background: '#1a1814',
                    border: '1px solid #3d3930',
                    fontSize: '0.95rem',
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--color-gold-500)'}
                  onBlur={(e) => e.target.style.borderColor = '#3d3930'}
                />
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="Email Address *"
                  required
                  className="w-full px-5 py-4 rounded-lg text-stone-100 placeholder-stone-500 focus:outline-none transition-all"
                  style={{
                    background: '#1a1814',
                    border: '1px solid #3d3930',
                    fontSize: '0.95rem',
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--color-gold-500)'}
                  onBlur={(e) => e.target.style.borderColor = '#3d3930'}
                />
              </div>

              {/* Row 2: Branch (CSE fixed) + Roll Number */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* CSE - fixed, non-editable */}
                <div
                  className="w-full px-5 py-4 rounded-lg flex items-center justify-between"
                  style={{
                    background: '#1a1814',
                    border: '1px solid #3d3930',
                    fontSize: '0.95rem',
                    color: '#e7e5e4',
                  }}
                >
                  <span>CSE</span>
                  <svg className="w-4 h-4 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                <input
                  type="text"
                  value={regRoll}
                  onChange={(e) => {
                    // Only allow numeric input
                    const val = e.target.value.replace(/\D/g, '')
                    if (val.length <= 13) setRegRoll(val)
                  }}
                  placeholder="Roll Number (224188..)"
                  className="w-full px-5 py-4 rounded-lg text-stone-100 placeholder-stone-500 focus:outline-none transition-all"
                  style={{
                    background: '#1a1814',
                    border: '1px solid #3d3930',
                    fontSize: '0.95rem',
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--color-gold-500)'}
                  onBlur={(e) => e.target.style.borderColor = '#3d3930'}
                />
              </div>

              {/* Password */}
              <input
                type="password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="Create Password *"
                required
                className="w-full px-5 py-4 rounded-lg text-stone-100 placeholder-stone-500 focus:outline-none transition-all"
                style={{
                  background: '#1a1814',
                  border: '1px solid #3d3930',
                  fontSize: '0.95rem',
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--color-gold-500)'}
                onBlur={(e) => e.target.style.borderColor = '#3d3930'}
              />

              {regError && (
                <p className="text-red-400 text-sm text-center">{regError}</p>
              )}

              {successMsg && (
                <div className="text-center py-3 px-4 rounded-lg" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}>
                  <p className="text-green-400 text-sm">✅ {successMsg}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-lg font-semibold text-base tracking-wide transition-all duration-300 cursor-pointer hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: 'var(--color-gold-500)',
                  color: '#1a1814',
                }}
              >
                {loading ? 'Submitting...' : 'Request Access'}
              </button>
            </form>

            {/* Divider + Switch */}
            <div className="mt-8 pt-5" style={{ borderTop: '1px solid #2d2a24' }}>
              <p className="text-center text-stone-500 text-sm">
                Already have an account?{' '}
                <button
                  onClick={switchMode}
                  className="font-semibold hover:underline cursor-pointer"
                  style={{ color: 'var(--color-gold-500)' }}
                >
                  Sign In
                </button>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
