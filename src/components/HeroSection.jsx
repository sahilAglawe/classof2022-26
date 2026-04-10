export default function HeroSection({ onStart }) {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Subtle radial glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-500/5 rounded-full blur-3xl" />

      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-stone-700 rounded-full mb-8 animate-fade-in">
          <span className="text-gold-500 text-sm">🎓</span>
          <span className="text-stone-400 text-xs tracking-widest uppercase font-medium">
            Class of 2022–2026
          </span>
        </div>

        {/* Main Title */}
        <h1
          className="text-5xl md:text-7xl font-bold mb-6 leading-tight animate-fade-in-up"
          style={{ fontFamily: 'var(--font-serif)', animationDelay: '0.15s', animationFillMode: 'backwards' }}
        >
          <span className="text-stone-100">Batch </span>
          <span className="text-gold-500">2022</span>
          <span className="text-stone-400">—</span>
          <span className="text-gold-500">26</span>
        </h1>

        {/* Tagline */}
        <p
          className="text-xl md:text-2xl text-stone-300 mb-4 animate-fade-in-up"
          style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', animationDelay: '0.3s', animationFillMode: 'backwards' }}
        >
          A Journey We'll Always Carry
        </p>

        {/* Description */}
        <p
          className="text-stone-400 text-base md:text-lg max-w-xl mx-auto mb-12 leading-relaxed animate-fade-in-up"
          style={{ animationDelay: '0.45s', animationFillMode: 'backwards' }}
        >
          Four years of laughter, late nights, and lessons learned. Join us as we look back
          on the moments that defined us.
        </p>

        {/* CTA Button */}
        <button
          onClick={onStart}
          className="group relative inline-flex items-center gap-3 cursor-pointer animate-fade-in-up"
          style={{ animationDelay: '0.6s', animationFillMode: 'backwards' }}
        >
          <span className="text-stone-400 text-sm tracking-widest uppercase font-medium group-hover:text-gold-500 transition-colors duration-300">
            Click to start the journey
          </span>
          <svg
            className="w-5 h-5 text-gold-500 group-hover:translate-y-1 transition-transform duration-300"
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-stone-900 to-transparent" />
    </section>
  )
}
