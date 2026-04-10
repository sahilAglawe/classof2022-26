export default function SignInModal({ onClose }) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-stone-900 border border-stone-700 rounded-lg p-8 w-full max-w-md mx-4 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-500 hover:text-stone-200 transition-colors cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-3xl mb-3 block">🎓</span>
          <h2
            className="text-2xl font-bold text-stone-100 mb-1"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Welcome Back
          </h2>
          <p className="text-stone-400 text-sm">Sign in to your Batch '26 account</p>
        </div>

        {/* Form */}
        <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-stone-300 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@sistec.ac.in"
              className="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-md text-stone-100 placeholder-stone-500 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-300 mb-1.5">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-md text-stone-100 placeholder-stone-500 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gold-500 hover:bg-gold-600 text-stone-900 font-semibold rounded-md transition-colors duration-300 cursor-pointer"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-stone-500 text-sm mt-6">
          Don't have an account?{' '}
          <button className="text-gold-500 hover:underline cursor-pointer">
            Create one
          </button>
        </p>
      </div>
    </div>
  )
}
