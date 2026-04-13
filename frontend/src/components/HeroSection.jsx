import { useState } from 'react'

export default function HeroSection({ onStart, onSignIn, user }) {
  const [hovered, setHovered] = useState(false)

  return (
    <section className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background — warm dark gradient with gold glow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(140, 90, 20, 0.15) 0%, transparent 70%), linear-gradient(to bottom, #0c0a09 0%, #1c1917 40%, #1a1613 100%)',
        }}
      />

      {/* Top right — Student Login or Welcome */}
      {user ? (
        <div className="absolute top-6 right-8 z-20 flex items-center gap-3">
          <span className="text-stone-400 text-xs tracking-wide">Welcome,</span>
          <span className="text-gold-500 text-sm font-semibold">{user.name.split(' ')[0]}</span>
        </div>
      ) : (
        <button
          onClick={onSignIn}
          className="absolute top-6 right-8 z-20 px-5 py-2 border border-stone-500 text-stone-200 text-xs font-semibold tracking-[0.2em] uppercase rounded-sm hover:border-gold-500 hover:text-gold-500 transition-all duration-300 cursor-pointer"
        >
          Student Login
        </button>
      )}

      {/* All hero content — shifts up on CTA hover */}
      <div
        className="relative z-10 text-center px-6 max-w-4xl mx-auto transition-transform duration-500 ease-out"
        style={{ transform: hovered ? 'translateY(-18px)' : 'translateY(0)' }}
      >
        {/* Tagline — gold italic handwriting above title */}
        <p
          className="text-gold-500 text-xl md:text-2xl mb-6 animate-fade-in"
          style={{
            fontFamily: 'var(--font-handwriting)',
            fontStyle: 'italic',
          }}
        >
          A Journey We'll Always Carry
        </p>

        {/* Main Title */}
        <h1
          className="mb-8 leading-[1.1] animate-fade-in-up"
          style={{
            fontFamily: 'var(--font-serif)',
            animationDelay: '0.15s',
            animationFillMode: 'backwards',
          }}
        >
          <span
            className="text-stone-100 text-6xl md:text-8xl lg:text-[7rem] font-bold whitespace-nowrap"
            style={{ fontStyle: 'normal' }}
          >
            Batch{' '}
          </span>
          <span
            className="text-stone-200 text-6xl md:text-8xl lg:text-[7rem] whitespace-nowrap"
            style={{ fontStyle: 'italic', fontWeight: 400 }}
          >
            2022
          </span>
          <span
            className="text-stone-400 text-5xl md:text-7xl lg:text-[6rem]"
            style={{ fontWeight: 300 }}
          >
            —
          </span>
          <span
            className="text-stone-200 text-6xl md:text-8xl lg:text-[7rem]"
            style={{ fontStyle: 'italic', fontWeight: 400 }}
          >
            26
          </span>
        </h1>

        {/* Gold underline */}
        <div
          className="w-16 h-[2px] mx-auto mb-10 animate-fade-in-up"
          style={{
            background: 'linear-gradient(to right, transparent, var(--color-gold-500), transparent)',
            animationDelay: '0.25s',
            animationFillMode: 'backwards',
          }}
        />

        {/* Description */}
        <p
          className="text-stone-400 text-base md:text-lg max-w-xl mx-auto mb-14 leading-relaxed animate-fade-in-up"
          style={{ animationDelay: '0.4s', animationFillMode: 'backwards' }}
        >
          Four years of laughter, late nights, and lessons learned. Join us as
          we look back on the moments that defined us.
        </p>

        {/* CTA — Click to start the journey */}
        <button
          onClick={onStart}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="group inline-flex flex-col items-center gap-5 cursor-pointer animate-fade-in-up"
          style={{ animationDelay: '0.55s', animationFillMode: 'backwards' }}
        >
          <span className="text-stone-500 text-[11px] tracking-[0.3em] uppercase font-medium group-hover:text-gold-500 transition-colors duration-300">
            Click to start the journey
          </span>
          {/* Vertical line */}
          <span className="hero-line block w-[1px] h-16 bg-gradient-to-b from-stone-500 to-transparent group-hover:from-gold-500 transition-colors duration-300" />
        </button>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-stone-900 to-transparent" />
    </section>
  )
}
