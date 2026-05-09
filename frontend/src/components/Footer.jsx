export default function Footer({ onNavClick, currentPage }) {
  return (
    <footer className="border-t border-stone-800 bg-stone-950">
      <div className="max-w-4xl mx-auto px-6 py-12 text-center">
        {/* Meet the class link — only on Journey */}
        {currentPage === 'journey' && (
          <button
            onClick={() => onNavClick('yearbook')}
            className="inline-flex items-center gap-2 text-stone-400 text-sm tracking-widest uppercase font-medium hover:text-gold-500 transition-colors duration-300 mb-10 cursor-pointer"
          >
            Meet the Class
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        )}
        
        {/* Divider with globe */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="w-16 h-px bg-stone-700" />
          <span className="text-stone-500 text-xl">🌐</span>
          <div className="w-16 h-px bg-stone-700" />
        </div>

        {/* Copyright */}
        <p
          className="text-stone-500 text-sm"
          style={{ fontFamily: 'var(--font-handwriting)', fontSize: '1rem' }}
        >
          © 2026 Batch . All memories preserved forever.
        </p>
      </div>
    </footer>
  )
}
