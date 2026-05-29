import { useState, useEffect } from 'react'

const filterOptions = [
  'All Memories',
  '1st Year',
  '2nd Year',
  '3rd Year',
  '4th Year',
  "Aura'25",
  "Aura'24",
  'Festivals',
  'Campus Life',
  'Farewell',
]

const MOCK_PHOTOS = [
  { id: 'p1', imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800', caption: 'First day of college!', tag: '1st Year', monthYear: 'August 2022', uploadedBy: 'Rahul' },
  { id: 'p2', imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=800', caption: 'Late night study group', tag: '2nd Year', monthYear: 'November 2023', uploadedBy: 'Sneha' },
  { id: 'p3', imageUrl: 'https://images.unsplash.com/photo-1511629091441-ee46146481b6?q=80&w=800', caption: 'Aura Fest was amazing', tag: "Aura'24", monthYear: 'March 2024', uploadedBy: 'Ananya' },
  { id: 'p4', imageUrl: 'https://images.unsplash.com/photo-1525926477800-7a3afdbbfc30?q=80&w=800', caption: 'Campus in the rain', tag: 'Campus Life', monthYear: 'July 2023', uploadedBy: 'Aarav' },
  { id: 'p5', imageUrl: 'https://images.unsplash.com/photo-1511988617509-24ac66f9b839?q=80&w=800', caption: 'Final year project presentation', tag: '4th Year', monthYear: 'May 2026', uploadedBy: 'Karan' },
]

export default function MediaVault() {
  const [activeFilter, setActiveFilter] = useState('All Memories')
  const [lightbox, setLightbox] = useState(null)
  const [lightboxIndex, setLightboxIndex] = useState(-1)
  const [newestFirst, setNewestFirst] = useState(true)
  const [visibleCount, setVisibleCount] = useState(6)
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch media (mocked)
  useEffect(() => {
    const fetchPhotos = () => {
      setLoading(true)
      setTimeout(() => {
        setPhotos(MOCK_PHOTOS)
        setLoading(false)
      }, 500)
    }
    fetchPhotos()
  }, [])

  const filtered =
    activeFilter === 'All Memories'
      ? photos
      : activeFilter === 'Festivals'
      ? photos.filter((p) => p.tag?.includes('Aura') || p.tag === 'Festivals')
      : photos.filter((p) => p.tag === activeFilter)

  const sortedPhotos = [...filtered].sort((a, b) => {
    // Basic string comparison works roughly for these mock dates, or just keep original order
    return newestFirst ? -1 : 1
  })

  // Lightbox navigation helpers
  const openLightbox = (photo) => {
    const idx = sortedPhotos.findIndex((p) => p.id === photo.id)
    setLightbox(photo)
    setLightboxIndex(idx)
  }

  const goToPrev = () => {
    if (lightboxIndex <= 0) return
    const newIdx = lightboxIndex - 1
    setLightboxIndex(newIdx)
    setLightbox(sortedPhotos[newIdx])
  }

  const goToNext = () => {
    if (lightboxIndex >= sortedPhotos.length - 1) return
    const newIdx = lightboxIndex + 1
    setLightboxIndex(newIdx)
    setLightbox(sortedPhotos[newIdx])
  }

  const closeLightbox = () => {
    setLightbox(null)
    setLightboxIndex(-1)
  }

  // Format monthYear into short badge format (e.g. "November 2024" -> "NOV 2024")
  const formatMonthBadge = (monthYear) => {
    if (!monthYear) return ''
    const parts = monthYear.split(' ')
    if (parts.length === 2) {
      return `${parts[0].substring(0, 3).toUpperCase()} ${parts[1]}`
    }
    return monthYear.toUpperCase()
  }

  return (
    <section className="min-h-screen">
      {/* Header */}
      <div className="bg-stone-950 pt-8 sm:pt-10 pb-4 sm:pb-6">
        <div className="px-4 sm:px-8">
          <h2
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-stone-100 mb-3 sm:mb-5"
            style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400 }}
          >
            The Archive
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-4">
            <p className="text-stone-400 text-sm sm:text-base md:text-lg max-w-md leading-relaxed">
              A cinematic collection of fleeting moments, frozen in time. From the first lecture to the final goodbye.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-stone-950 py-4 sm:py-6">
        <div className="px-4 sm:px-8">
          {/* Filters — scrollable on mobile */}
          <div className="flex items-center gap-2 mb-4 sm:mb-6 overflow-x-auto no-scrollbar pb-1">
            {filterOptions.map((f) => (
              <button
                key={f}
                onClick={() => { setActiveFilter(f); setVisibleCount(6) }}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 cursor-pointer flex-shrink-0 ${
                  activeFilter === f
                    ? 'bg-gold-500 text-stone-900'
                    : 'bg-stone-900 border border-stone-700 text-stone-400 hover:border-stone-400 hover:text-stone-200'
                }`}
              >
                {f}
              </button>
            ))}

            <button
              onClick={() => setNewestFirst(!newestFirst)}
              className="ml-auto px-3 py-1.5 sm:py-2 bg-stone-900 border border-stone-700 rounded-full text-stone-400 text-xs sm:text-sm cursor-pointer hover:text-stone-200 hover:border-stone-400 transition-all flex-shrink-0"
            >
              {newestFirst ? '↓ Newest' : '↑ Oldest'}
            </button>
          </div>

          {/* Divider */}
          <div className="border-t border-stone-700 mb-8"></div>

          {/* Loading */}
          {loading && (
            <div className="text-center py-16">
              <p className="text-stone-500 text-lg">Loading memories...</p>
            </div>
          )}

          {/* Photo Grid */}
          {!loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {sortedPhotos.slice(0, visibleCount).map((photo) => (
                <div
                  key={photo.id}
                  onClick={() => openLightbox(photo)}
                  className="group relative overflow-hidden rounded-xl cursor-pointer bg-stone-800"
                >
                  <img
                    src={photo.imageUrl}
                    alt={photo.caption}
                    className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <div>
                      {photo.monthYear && (
                        <p className="text-gold-500 text-xs tracking-wider uppercase font-medium mb-1">
                          {photo.monthYear}
                        </p>
                      )}
                      <p
                        className="text-stone-100 text-lg"
                        style={{ fontFamily: 'var(--font-handwriting)' }}
                      >
                        {photo.caption}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Unlock More */}
          {!loading && visibleCount < sortedPhotos.length && (
            <div className="text-center mt-12">
              <button
                onClick={() => setVisibleCount((prev) => prev + 6)}
                className="inline-flex items-center gap-2 px-8 py-3 border border-stone-600 text-stone-400 text-sm tracking-[0.2em] uppercase font-medium rounded-sm hover:border-gold-500 hover:text-gold-500 transition-all duration-300 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
                Unlock More Vault Items
              </button>
            </div>
          )}

          {!loading && sortedPhotos.length === 0 && (
            <div className="text-center py-16">
              <p className="text-stone-500 text-lg">
                No memories found for this filter.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox — Split Panel Design */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/92 backdrop-blur-md animate-fade-in"
          onClick={closeLightbox}
        >
          {/* Close button — top-left */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 left-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm text-stone-300 hover:text-white hover:bg-white/20 transition-all cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>

          {/* Main container — split layout */}
          <div
            className="relative w-full max-w-6xl mx-2 sm:mx-6 max-h-[95vh] flex flex-col lg:flex-row rounded-2xl overflow-hidden"
            style={{
              background: '#0c0b09',
              boxShadow: '0 40px 100px rgba(0,0,0,0.8)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* ===== LEFT: Photo Area ===== */}
            <div className="relative flex-1 min-h-[45vw] sm:min-h-[300px] lg:min-h-0 bg-black flex items-center justify-center">
              <img
                src={lightbox.imageUrl}
                alt={lightbox.caption}
                className="w-full h-full max-h-[40vh] sm:max-h-[50vh] lg:max-h-[92vh] object-contain"
              />

              {/* Previous arrow */}
              {lightboxIndex > 0 && (
                <button
                  onClick={goToPrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-sm text-stone-300 hover:text-white hover:bg-black/70 transition-all cursor-pointer"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}

              {/* Next arrow */}
              {lightboxIndex < sortedPhotos.length - 1 && (
                <button
                  onClick={goToNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-sm text-stone-300 hover:text-white hover:bg-black/70 transition-all cursor-pointer"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}

              {/* Photo counter pill */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm text-stone-400 text-xs font-medium">
                {lightboxIndex + 1} / {sortedPhotos.length}
              </div>
            </div>

            {/* ===== RIGHT: Info Panel ===== */}
            <div
              className="w-full lg:w-[300px] xl:w-[340px] flex flex-col flex-shrink-0"
              style={{
                background: 'linear-gradient(180deg, #161412, #111010)',
                borderLeft: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              {/* Caption section */}
              <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4">
                <h3
                  className="text-lg sm:text-xl lg:text-2xl text-stone-100 leading-snug mb-3 sm:mb-4"
                  style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400 }}
                >
                  {lightbox.caption}
                </h3>

                {/* Month & Filter badges */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {lightbox.monthYear && (
                    <span
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-bold tracking-wider uppercase"
                      style={{
                        background: 'rgba(196,164,75,0.12)',
                        color: 'var(--color-gold-500)',
                        border: '1px solid rgba(196,164,75,0.25)',
                      }}
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {formatMonthBadge(lightbox.monthYear)}
                    </span>
                  )}
                  {lightbox.tag && (
                    <span
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-bold tracking-wider uppercase"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        color: '#a8a29e',
                        border: '1px solid rgba(255,255,255,0.1)',
                      }}
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      {lightbox.tag}
                    </span>
                  )}
                </div>

                {/* Uploader info */}
                <div className="flex items-center gap-2.5 py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: 'rgba(196,164,75,0.15)', color: 'var(--color-gold-500)' }}
                  >
                    {lightbox.uploadedBy ? lightbox.uploadedBy.charAt(0).toUpperCase() : '?'}
                  </div>
                  <div>
                    <p className="text-stone-300 text-sm font-medium leading-tight">{lightbox.uploadedBy || 'Anonymous'}</p>
                    <p className="text-stone-600 text-[10px]">Uploaded this memory</p>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="mx-5 sm:mx-6 border-t border-stone-800/60" />

              {/* Comments section */}
              <div className="flex-1 px-4 sm:px-6 py-4 overflow-y-auto no-scrollbar">
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
                    style={{ background: 'rgba(196,164,75,0.06)', border: '1px solid rgba(196,164,75,0.1)' }}
                  >
                    <svg className="w-7 h-7" style={{ color: 'var(--color-gold-500)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <p className="text-stone-500 text-sm italic mb-1">No comments yet.</p>
                  <p className="text-stone-600 text-xs">Viewing archived memory.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
