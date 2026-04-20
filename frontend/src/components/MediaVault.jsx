import { useState, useEffect, useRef } from 'react'
import { getMediaItems, addMediaItem } from '../firebase/firestore'
import { uploadMediaImage } from '../firebase/storage'

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

// Generate month/year options from Aug 2022 to May 2026
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function generateMonthYearOptions() {
  const options = []
  const startYear = 2022
  const startMonth = 7 // August (0-indexed)
  const endYear = 2026
  const endMonth = 4 // May (0-indexed)

  for (let year = startYear; year <= endYear; year++) {
    const mStart = year === startYear ? startMonth : 0
    const mEnd = year === endYear ? endMonth : 11
    for (let month = mStart; month <= mEnd; month++) {
      options.push({ label: `${MONTHS[month]} ${year}`, month, year })
    }
  }
  return options
}

const MONTH_YEAR_OPTIONS = generateMonthYearOptions()

// Get a smart default — current month if within range, else latest
function getDefaultMonthYear() {
  const now = new Date()
  const current = MONTH_YEAR_OPTIONS.find(
    (o) => o.month === now.getMonth() && o.year === now.getFullYear()
  )
  return current ? current.label : MONTH_YEAR_OPTIONS[MONTH_YEAR_OPTIONS.length - 1].label
}

export default function MediaVault({ user }) {
  const [activeFilter, setActiveFilter] = useState('All Memories')
  const [lightbox, setLightbox] = useState(null)
  const [lightboxIndex, setLightboxIndex] = useState(-1)
  const [newestFirst, setNewestFirst] = useState(true)
  const [visibleCount, setVisibleCount] = useState(6)
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)

  // Upload modal state
  const [showUpload, setShowUpload] = useState(false)
  const [uploadFile, setUploadFile] = useState(null)
  const [uploadPreview, setUploadPreview] = useState(null)
  const [uploadCaption, setUploadCaption] = useState('')
  const [uploadTag, setUploadTag] = useState('1st Year')
  const [uploadMonthYear, setUploadMonthYear] = useState(getDefaultMonthYear())
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState('') // 'compressing' | 'uploading'
  const [dragActive, setDragActive] = useState(false)
  const fileRef = useRef(null)

  // Fetch media from Firestore
  useEffect(() => {
    fetchPhotos()
  }, [])

  const fetchPhotos = async () => {
    setLoading(true)
    try {
      const items = await getMediaItems()
      setPhotos(items)
    } catch (err) {
      console.error('Error fetching media:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploadFile(file)
    setUploadPreview(URL.createObjectURL(file))
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true)
    else if (e.type === 'dragleave') setDragActive(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      setUploadFile(file)
      setUploadPreview(URL.createObjectURL(file))
    }
  }

  const resetUploadForm = () => {
    setShowUpload(false)
    setUploadFile(null)
    setUploadPreview(null)
    setUploadCaption('')
    setUploadTag('1st Year')
    setUploadMonthYear(getDefaultMonthYear())
    setUploadProgress(0)
    setUploadStatus('')
  }

  const handleUpload = async () => {
    if (!uploadFile || !uploadCaption.trim() || !user) return
    setUploading(true)
    setUploadProgress(0)
    setUploadStatus('compressing')
    try {
      const imageUrl = await uploadMediaImage(
        user.uid,
        uploadFile,
        (progress) => setUploadProgress(progress),
        (status) => setUploadStatus(status)
      )
      setUploadStatus('saving')
      await addMediaItem({
        imageUrl,
        caption: uploadCaption.trim(),
        tag: uploadTag,
        monthYear: uploadMonthYear,
        uploadedBy: user.name,
        uploadedByUid: user.uid,
      })
      await fetchPhotos()
      resetUploadForm()
    } catch (err) {
      alert('Error uploading: ' + err.message)
    } finally {
      setUploading(false)
      setUploadStatus('')
    }
  }



  const filtered =
    activeFilter === 'All Memories'
      ? photos
      : activeFilter === 'Festivals'
      ? photos.filter((p) => p.tag?.includes('Aura') || p.tag === 'Festivals')
      : photos.filter((p) => p.tag === activeFilter)

  const sortedPhotos = [...filtered].sort((a, b) => {
    const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0)
    const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0)
    return newestFirst ? dateB - dateA : dateA - dateB
  })

  const tagOptions = filterOptions.filter((f) => f !== 'All Memories' && f !== 'Festivals')

  // Step indicator for the upload flow
  const uploadStep = !uploadFile ? 1 : 2

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
      <div className="bg-stone-950 pt-10 pb-6">
        <div className="px-8">
          <h2
            className="text-6xl md:text-7xl lg:text-8xl text-stone-100 mb-5"
            style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400 }}
          >
            The Archive
          </h2>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <p className="text-stone-400 text-base md:text-lg max-w-md leading-relaxed">
              A cinematic collection of fleeting moments, frozen in time. From the first lecture to the final goodbye.
            </p>

            {/* Add Photo — visible only to logged-in users */}
            {user && (
              <button
                onClick={() => setShowUpload(true)}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-gold-500 text-stone-900 text-sm font-semibold tracking-wide rounded-lg hover:brightness-110 transition-all cursor-pointer self-start md:self-auto"
              >
                ＋ Add Photos
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-stone-950 py-6">
        <div className="px-8">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {filterOptions.map((f) => (
              <button
                key={f}
                onClick={() => { setActiveFilter(f); setVisibleCount(6) }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${
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
              className="ml-auto px-3 py-2 bg-stone-900 border border-stone-700 rounded-full text-stone-400 text-sm cursor-pointer hover:text-stone-200 hover:border-stone-400 transition-all"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                {photos.length === 0
                  ? 'No memories yet. Be the first to add one!'
                  : 'No memories found for this filter.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ============================== */}
      {/* Lightbox — Split Panel Design  */}
      {/* ============================== */}
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
            className="relative w-full max-w-6xl mx-3 sm:mx-6 max-h-[92vh] flex flex-col lg:flex-row rounded-2xl overflow-hidden"
            style={{
              background: '#0c0b09',
              boxShadow: '0 40px 100px rgba(0,0,0,0.8)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* ===== LEFT: Photo Area ===== */}
            <div className="relative flex-1 min-h-[300px] lg:min-h-0 bg-black flex items-center justify-center">
              <img
                src={lightbox.imageUrl}
                alt={lightbox.caption}
                className="w-full h-full max-h-[50vh] lg:max-h-[92vh] object-contain"
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
              className="w-full lg:w-[340px] xl:w-[380px] flex flex-col flex-shrink-0"
              style={{
                background: 'linear-gradient(180deg, #161412, #111010)',
                borderLeft: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              {/* Caption section */}
              <div className="px-5 sm:px-6 pt-6 pb-4">
                <h3
                  className="text-xl sm:text-2xl text-stone-100 leading-snug mb-4"
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
              <div className="flex-1 px-5 sm:px-6 py-5 overflow-y-auto no-scrollbar">
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
                  <p className="text-stone-600 text-xs">Be the first to share a memory.</p>
                </div>
              </div>

              {/* Comment input bar */}
              <div
                className="px-5 sm:px-6 py-4 flex-shrink-0"
                style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(12,11,9,0.6)' }}
              >
                {user ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Leave a comment..."
                      className="flex-1 px-4 py-2.5 rounded-xl text-stone-200 placeholder-stone-600 text-sm focus:outline-none"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                      onFocus={(e) => e.target.style.borderColor = 'rgba(196,164,75,0.4)'}
                      onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                    />
                    <button
                      className="w-10 h-10 flex items-center justify-center rounded-xl transition-all cursor-pointer hover:brightness-110"
                      style={{ background: 'var(--color-gold-500)' }}
                    >
                      <svg className="w-4 h-4 text-stone-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <button
                    className="w-full py-3 rounded-xl text-sm font-medium text-stone-400 transition-all cursor-pointer"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    Sign in to leave a comment
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================== */}
      {/* Upload Modal — Redesigned */}
      {/* ============================== */}
      {showUpload && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={() => !uploading && resetUploadForm()}
        >
          <div
            className="w-full max-w-2xl mx-3 sm:mx-4 rounded-2xl relative overflow-hidden"
            style={{
              background: 'linear-gradient(160deg, #1e1c18, #171510)',
              border: '1px solid rgba(196, 164, 75, 0.2)',
              boxShadow: '0 30px 80px rgba(0,0,0,0.6), 0 0 60px rgba(196,164,75,0.04)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top decorative accent line */}
            <div
              className="h-[2px] w-full"
              style={{ background: 'linear-gradient(90deg, transparent, var(--color-gold-500), transparent)' }}
            />

            {/* Header with step dots */}
            <div className="flex items-center justify-between px-5 sm:px-8 pt-6 pb-2">
              <div>
                <h3
                  className="text-2xl sm:text-3xl"
                  style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--color-gold-500)' }}
                >
                  Add to the Vault
                </h3>
                <p className="text-stone-500 text-xs mt-1 tracking-wide">
                  {uploadStep === 1 ? 'Select your photo' : 'Add details to your memory'}
                </p>
              </div>
              <button
                onClick={() => !uploading && resetUploadForm()}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-stone-800/60 text-stone-400 hover:text-stone-200 hover:bg-stone-700/80 transition-all cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            {/* Step dots */}
            <div className="flex items-center gap-2 px-5 sm:px-8 pb-5">
              <div
                className="h-1 rounded-full transition-all duration-500"
                style={{
                  width: '40px',
                  background: 'var(--color-gold-500)',
                }}
              />
              <div
                className="h-1 rounded-full transition-all duration-500"
                style={{
                  width: '40px',
                  background: uploadStep >= 2 ? 'var(--color-gold-500)' : '#3d3930',
                }}
              />
            </div>

            {/* Scrollable body */}
            <div className="px-5 sm:px-8 pb-6 max-h-[65vh] overflow-y-auto no-scrollbar">

              {/* Image picker / preview */}
              {uploadPreview ? (
                <div className="relative mb-5 rounded-xl overflow-hidden group">
                  <img src={uploadPreview} alt="Preview" className="w-full aspect-[16/10] object-cover" />
                  {/* Overlay with gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  {/* File info badge */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-black/60 backdrop-blur-sm text-stone-300 text-[11px] rounded-md font-medium">
                      📷 {uploadFile && (uploadFile.size / (1024 * 1024)).toFixed(1)} MB
                    </span>
                  </div>
                  <button
                    onClick={() => { setUploadFile(null); setUploadPreview(null) }}
                    className="absolute top-3 right-3 px-3 py-1.5 bg-black/60 backdrop-blur-sm text-stone-200 text-xs rounded-lg hover:bg-red-500/90 hover:text-white transition-all cursor-pointer flex items-center gap-1"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Remove
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileRef.current?.click()}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className="w-full aspect-[16/10] rounded-xl flex flex-col items-center justify-center cursor-pointer mb-5 transition-all duration-300"
                  style={{
                    border: `2px dashed ${dragActive ? 'var(--color-gold-500)' : '#3d3930'}`,
                    background: dragActive ? 'rgba(196,164,75,0.04)' : 'rgba(26,24,20,0.5)',
                  }}
                >
                  <div
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300"
                    style={{
                      background: dragActive ? 'rgba(196,164,75,0.15)' : 'rgba(196,164,75,0.06)',
                      border: `1px solid ${dragActive ? 'rgba(196,164,75,0.3)' : 'rgba(196,164,75,0.1)'}`,
                    }}
                  >
                    <svg
                      className="w-8 h-8 sm:w-10 sm:h-10 transition-colors duration-300"
                      style={{ color: dragActive ? 'var(--color-gold-500)' : '#78716c' }}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-stone-400 text-sm font-medium mb-1">
                    {dragActive ? 'Drop your photo here' : 'Click or drag a photo here'}
                  </p>
                  <p className="text-stone-600 text-xs">JPG, PNG, WebP — max 10MB</p>
                </div>
              )}
              <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />

              {/* Details section — only shown after image is selected */}
              {uploadFile && (
                <div className="space-y-4 animate-fade-in">
                  {/* Caption */}
                  <div>
                    <label className="text-stone-400 text-xs tracking-wider uppercase mb-2 block font-medium">
                      Caption <span className="text-gold-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={uploadCaption}
                      onChange={(e) => setUploadCaption(e.target.value)}
                      placeholder="Describe this memory..."
                      maxLength={120}
                      className="w-full px-4 py-3.5 rounded-xl text-stone-100 placeholder-stone-600 focus:outline-none transition-all text-sm"
                      style={{ background: 'rgba(26,24,20,0.8)', border: '1px solid #3d3930' }}
                      onFocus={(e) => e.target.style.borderColor = 'var(--color-gold-500)'}
                      onBlur={(e) => e.target.style.borderColor = '#3d3930'}
                    />
                    <p className="text-stone-600 text-[10px] text-right mt-1">{uploadCaption.length}/120</p>
                  </div>

                  {/* Month & Year + Category — side by side on desktop */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Month & Year Picker */}
                    <div>
                      <label className="text-stone-400 text-xs tracking-wider uppercase mb-2 block font-medium">
                        <span className="inline-flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          When was this?
                        </span>
                      </label>
                      <div className="relative">
                        <select
                          value={uploadMonthYear}
                          onChange={(e) => setUploadMonthYear(e.target.value)}
                          className="w-full px-4 py-3.5 rounded-xl text-stone-100 focus:outline-none transition-all text-sm appearance-none cursor-pointer"
                          style={{
                            background: 'rgba(26,24,20,0.8)',
                            border: '1px solid #3d3930',
                          }}
                          onFocus={(e) => e.target.style.borderColor = 'var(--color-gold-500)'}
                          onBlur={(e) => e.target.style.borderColor = '#3d3930'}
                        >
                          {MONTH_YEAR_OPTIONS.map((opt) => (
                            <option key={opt.label} value={opt.label} style={{ background: '#1a1814', color: '#e7e5e4' }}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        {/* Custom dropdown arrow */}
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                          <svg className="w-4 h-4 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Category — compact dropdown on this row */}
                    <div>
                      <label className="text-stone-400 text-xs tracking-wider uppercase mb-2 block font-medium">
                        <span className="inline-flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                          Category
                        </span>
                      </label>
                      <div className="relative">
                        <select
                          value={uploadTag}
                          onChange={(e) => setUploadTag(e.target.value)}
                          className="w-full px-4 py-3.5 rounded-xl text-stone-100 focus:outline-none transition-all text-sm appearance-none cursor-pointer"
                          style={{
                            background: 'rgba(26,24,20,0.8)',
                            border: '1px solid #3d3930',
                          }}
                          onFocus={(e) => e.target.style.borderColor = 'var(--color-gold-500)'}
                          onBlur={(e) => e.target.style.borderColor = '#3d3930'}
                        >
                          {tagOptions.map((tag) => (
                            <option key={tag} value={tag} style={{ background: '#1a1814', color: '#e7e5e4' }}>
                              {tag}
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                          <svg className="w-4 h-4 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Selected summary pills */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium bg-gold-500/10 text-gold-500 border border-gold-500/20">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {uploadMonthYear}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium bg-stone-800 text-stone-400 border border-stone-700">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      {uploadTag}
                    </span>
                  </div>
                </div>
              )}

              {/* Progress bar */}
              {uploading && (
                <div className="mt-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-stone-400 text-xs font-medium">
                      {uploadStatus === 'compressing' && '🔄 Compressing image...'}
                      {uploadStatus === 'uploading' && '📤 Uploading to vault...'}
                      {uploadStatus === 'saving' && '💾 Saving to archive...'}
                    </span>
                    {uploadStatus === 'uploading' && (
                      <span className="text-gold-500 text-xs font-bold">{uploadProgress}%</span>
                    )}
                  </div>
                  <div className="w-full h-1.5 bg-stone-800 rounded-full overflow-hidden">
                    {uploadStatus === 'compressing' ? (
                      <div className="h-full rounded-full animate-pulse" style={{ width: '100%', background: '#555' }} />
                    ) : (
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%`, background: 'linear-gradient(90deg, var(--color-gold-500), #e8c547)' }}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Fixed bottom action bar */}
            <div
              className="px-5 sm:px-8 py-4"
              style={{ borderTop: '1px solid rgba(61,57,48,0.5)', background: 'rgba(23,21,16,0.8)' }}
            >
              <button
                onClick={handleUpload}
                disabled={uploading || !uploadFile || !uploadCaption.trim()}
                className="w-full py-3.5 rounded-xl font-semibold text-sm tracking-wide transition-all duration-300 cursor-pointer hover:brightness-110 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ background: 'var(--color-gold-500)', color: '#1a1814' }}
              >
                {uploading
                  ? uploadStatus === 'compressing'
                    ? '🔄 Compressing...'
                    : uploadStatus === 'saving'
                    ? '💾 Saving...'
                    : `📤 Uploading... ${uploadProgress}%`
                  : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      Upload to Vault
                    </>
                  )}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
