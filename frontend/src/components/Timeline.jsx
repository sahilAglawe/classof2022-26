import { useEffect, useRef, useState } from 'react'

const timelineData = [
  {
    year: '2022',
    title: 'The First Hello',
    description:
      '"Do you know where CSE Department is?" That was the question that started it all. We were lost, nervous, and carrying way too many bags.',
    image: '/images/bit-gate.jpg',
    caption: 'First day on campus 🍂',
    side: 'left',
  },
  {
    year: '2023',
    title: 'Finding Our Feet',
    description:
      'The library became our second home. We stressed over midterms, but those class bunks in between made everything feel lighter.',
    image: '/images/library-study.png',
    caption: 'Library all-nighter... again 📚',
    side: 'right',
  },
  {
    year: '2023',
    title: 'We Became the Seniors',
    description:
      "It was the beginning when we first stepped into the department building. We made endless memories there, and before we knew it, it became our second home. From lost juniors to confident seniors, we grew with every moment. And now, those memories are something we’ll carry forever.",
    image: '/images/freshers-night.png',
    caption: "Freshers' night — their first, our finest 🎊",
    side: 'left',
  },
  {
    year: '2025',
    title: 'A Goodbye Worth Remembering',
    description:
      'We weren\'t just saying goodbye to our seniors — we were saying goodbye to a version of ourselves. The farewell wasn\'t just theirs. It was ours too.',
    image: '/images/farewell.png',
    caption: 'The farewell that hit different 💐',
    side: 'right',
  },
  {
    year: '2026',
    title: 'Graduation',
    description:
      'Four years felt like four minutes. We walked in as strangers and walked out as family. This chapter ends, but the story? It\'s just getting started.',
    image: '/images/graduation.png',
    caption: "We made it. Class of '26 🎓",
    side: 'center',
  },
]

function TimelineNode({ item, index }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.15 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const isCenter = item.side === 'center'
  const isRight = item.side === 'right'

  if (isCenter) {
    return (
      <div ref={ref} className="relative flex flex-col items-center mb-16 sm:mb-24">
        {/* Year badge */}
        <div className="year-badge mb-6 sm:mb-8">{item.year}</div>

        <div
          className={`w-full max-w-2xl transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          style={{ transitionDelay: '0.2s' }}
        >
          {/* Polaroid */}
          <div className="polaroid polaroid-center mx-auto group/img" style={{ maxWidth: '550px' }}>
            <img
              src={item.image}
              alt={item.title}
              className="w-full aspect-[4/3] object-cover grayscale transition-[filter] duration-500 group-hover/img:grayscale-0"
            />
            <p className="polaroid-caption">{item.caption}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div ref={ref} className="relative mb-16 sm:mb-24">
      {/* Year badge - centered */}
      <div className="flex justify-center mb-8 sm:mb-12">
        <div className="year-badge">{item.year}</div>
      </div>

      <div
        className={`grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 items-center ${isRight ? 'lg:direction-rtl' : ''
          }`}
      >
        {/* Image side */}
        <div
          className={`${isRight ? 'lg:order-2' : 'lg:order-1'} transition-all duration-700 ${visible
            ? 'opacity-100 translate-x-0'
            : isRight
              ? 'opacity-0 translate-x-16'
              : 'opacity-0 -translate-x-16'
            }`}
          style={{ transitionDelay: '0.2s' }}
        >
          <div
            className={`polaroid ${isRight ? 'polaroid-right' : ''} group/img mx-auto lg:mx-0`}
            style={{
              maxWidth: '500px',
              margin: isRight ? undefined : undefined,
            }}
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full aspect-[4/3] object-cover grayscale transition-[filter] duration-500 group-hover/img:grayscale-0"
            />
            <p className="polaroid-caption">{item.caption}</p>
          </div>
        </div>

        {/* Text side */}
        <div
          className={`${isRight ? 'lg:order-1' : 'lg:order-2'} transition-all duration-700 text-center lg:text-left ${visible
            ? 'opacity-100 translate-x-0'
            : isRight
              ? 'opacity-0 -translate-x-16'
              : 'opacity-0 translate-x-16'
            }`}
          style={{ transitionDelay: '0.4s' }}
        >
          <h3
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-stone-100 mb-3 sm:mb-4"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            {item.title}
          </h3>
          <p className="text-stone-400 text-base sm:text-lg leading-relaxed">{item.description}</p>
        </div>
      </div>
    </div>
  )
}

export default function Timeline() {
  return (
    <section id="timeline" className="relative py-12 sm:py-16 md:py-24">
      {/* Central timeline line (visible on large screens) */}
      <div className="hidden lg:block timeline-line" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className="text-center mb-12 sm:mb-20">
          <span className="inline-block px-4 py-1.5 border border-gold-500 text-gold-500 text-xs tracking-widest uppercase font-medium rounded-full mb-4 sm:mb-6">
            Our History
          </span>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-stone-100"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            The Journey: 2022–2026
          </h2>
        </div>

        {/* Timeline nodes */}
        {timelineData.map((item, index) => (
          <TimelineNode key={index} item={item} index={index} />
        ))}

        {/* Closing quote — immediately after last photo */}
        <div className="text-center pt-6 sm:pt-8 pb-4">
          <p
            className="text-lg sm:text-xl md:text-2xl text-stone-300 leading-relaxed"
            style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}
          >
            Four years. Countless memories. One unforgettable journey.
            <br />
            This isn't the end, it's just the beginning.
          </p>
        </div>
      </div>
    </section>
  )
}
