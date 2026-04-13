import { useState } from 'react'

const photos = [
  { src: '/images/campus-gate.png', caption: 'Where it all began', tag: '1st yr', aspect: 'tall' },
  { src: '/images/campus-life.png', caption: 'Canteen chronicles', tag: '2nd yr', aspect: 'wide' },
  { src: '/images/library-study.png', caption: 'Burning the midnight oil', tag: '2nd yr', aspect: 'square' },
  { src: '/images/freshers-night.png', caption: "Freshers' night magic", tag: '3rd yr', aspect: 'wide' },
  { src: '/images/hackathon.png', caption: 'SAMADHAN 1.0 — Code warriors', tag: '3rd yr', aspect: 'tall' },
  { src: '/images/farewell.png', caption: 'The farewell we\'ll never forget', tag: '4th yr', aspect: 'square' },
  { src: '/images/college-fest.png', caption: "Fiesta'25 — Our finest hour", tag: "Fiesta'25", aspect: 'wide' },
  { src: '/images/graduation.png', caption: 'To new beginnings', tag: '4th yr', aspect: 'tall' },
]

const filters = ['All Memories', '1st yr', '2nd yr', '3rd yr', '4th yr', "Fiesta'26", "Fiesta'25"]

export default function MediaVault() {
  const [activeFilter, setActiveFilter] = useState('All Memories')
  const [lightbox, setLightbox] = useState(null)
  const [newestFirst, setNewestFirst] = useState(true)

  const filtered =
    activeFilter === 'All Memories'
      ? photos
      : photos.filter((p) => p.tag === activeFilter)

  const sortedPhotos = newestFirst ? [...filtered].reverse() : filtered

  return (
    <section className="min-h-screen">
      {/* Header area — visually distinct from content, sits below navbar */}
      <div className="bg-stone-950 pt-10 pb-14">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="text-center md:text-left">
              <h2
                className="text-6xl md:text-7xl lg:text-8xl text-stone-100 mb-5"
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontStyle: 'italic',
                  fontWeight: 400,
                }}
              >
                The Archive
              </h2>
              <p className="text-stone-400 text-base md:text-lg max-w-xl leading-relaxed">
                A cinematic collection of fleeting moments, frozen in
                time. From the first lecture to the final goodbye.
              </p>
            </div>

            {/* Newest First toggle */}
            <button
              onClick={() => setNewestFirst(!newestFirst)}
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-stone-600 rounded-full text-sm font-medium tracking-wide transition-all duration-300 cursor-pointer hover:border-gold-500 hover:text-gold-500 flex-shrink-0"
              style={{ color: newestFirst ? 'var(--color-gold-500)' : undefined }}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 4h13M3 8h9M3 12h5m4 0l4-4m0 0l4 4m-4-4v12"
                />
              </svg>
              {newestFirst ? 'Newest First' : 'Oldest First'}
            </button>
          </div>
        </div>
      </div>

      {/* Content area — darker background to separate from header/navbar */}
      <div className="bg-stone-950 py-10">
        <div className="max-w-6xl mx-auto px-6">
          {/* Filter pills */}
          <div className="flex flex-wrap gap-3 mb-12">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${
                  activeFilter === f
                    ? 'bg-gold-500 text-stone-900'
                    : 'border border-stone-600 text-stone-400 hover:border-stone-400 hover:text-stone-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Photo Grid — 3 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedPhotos.map((photo, i) => (
              <div
                key={i}
                onClick={() => setLightbox(photo)}
                className="group relative overflow-hidden rounded-xl cursor-pointer bg-stone-800"
              >
                <img
                  src={photo.src}
                  alt={photo.caption}
                  className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <div>
                    <p
                      className="text-stone-100 text-lg mb-1"
                      style={{ fontFamily: 'var(--font-handwriting)' }}
                    >
                      {photo.caption}
                    </p>
                    <span className="text-gold-500 text-xs tracking-wider uppercase font-medium">
                      {photo.tag}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-stone-500 text-lg">No memories found for this filter.</p>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md animate-fade-in"
          onClick={() => setLightbox(null)}
        >
          <div className="relative max-w-4xl max-h-[85vh] mx-4">
            <button
              onClick={() => setLightbox(null)}
              className="absolute -top-10 right-0 text-stone-400 hover:text-white transition-colors text-2xl cursor-pointer"
            >
              ✕
            </button>
            <img
              src={lightbox.src}
              alt={lightbox.caption}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
            <p
              className="text-center text-stone-300 mt-4 text-xl"
              style={{ fontFamily: 'var(--font-handwriting)' }}
            >
              {lightbox.caption}
            </p>
          </div>
        </div>
      )}
    </section>
  )
}
