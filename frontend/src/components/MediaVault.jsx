import { useState, useEffect, useRef } from 'react'
import { getMediaItems, addMediaItem, deleteMediaItem } from '../firebase/firestore'
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

export default function MediaVault({ user }) {
  const [activeFilter, setActiveFilter] = useState('All Memories')
  const [lightbox, setLightbox] = useState(null)
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
  const [uploading, setUploading] = useState(false)
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

  const handleUpload = async () => {
    if (!uploadFile || !uploadCaption.trim() || !user) return
    setUploading(true)
    try {
      const imageUrl = await uploadMediaImage(user.uid, uploadFile)
      await addMediaItem({
        imageUrl,
        caption: uploadCaption.trim(),
        tag: uploadTag,
        uploadedBy: user.name,
        uploadedByUid: user.uid,
      })
      // Refresh
      await fetchPhotos()
      // Reset
      setShowUpload(false)
      setUploadFile(null)
      setUploadPreview(null)
      setUploadCaption('')
      setUploadTag('1st Year')
    } catch (err) {
      alert('Error uploading: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (photo) => {
    if (!window.confirm('Delete this photo?')) return
    try {
      await deleteMediaItem(photo.id)
      setPhotos((prev) => prev.filter((p) => p.id !== photo.id))
      setLightbox(null)
    } catch (err) {
      alert('Error deleting: ' + err.message)
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

  return (
    <section className="min-h-screen">
      {/* Header */}
      <div className="bg-stone-950 pt-10 pb-6">
        <div className="px-8 text-center">
          <span className="inline-block px-4 py-1.5 border border-gold-500 text-gold-500 text-xs tracking-widest uppercase font-medium rounded-full mb-6">
            📸 Photo Archive
          </span>
          <h2
            className="text-5xl md:text-6xl lg:text-7xl text-stone-100 mb-4"
            style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400 }}
          >
            Media Vault
          </h2>
          <p className="text-stone-400 text-lg max-w-xl mx-auto mb-6">
            A visual journey through our years together, curated by the batch.
          </p>

          {/* Add Photo — visible only to logged-in users */}
          {user && (
            <button
              onClick={() => setShowUpload(true)}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gold-500 text-stone-900 text-sm font-semibold tracking-wide rounded-lg hover:brightness-110 transition-all cursor-pointer"
            >
              ＋ Add Photos
            </button>
          )}
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
                  onClick={() => setLightbox(photo)}
                  className="group relative overflow-hidden rounded-xl cursor-pointer bg-stone-800"
                >
                  <img
                    src={photo.imageUrl}
                    alt={photo.caption}
                    className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <div>
                      <p
                        className="text-stone-100 text-lg mb-1"
                        style={{ fontFamily: 'var(--font-handwriting)' }}
                      >
                        {photo.caption}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-gold-500 text-xs tracking-wider uppercase font-medium">
                          {photo.tag}
                        </span>
                        <span className="text-stone-500 text-xs">by {photo.uploadedBy}</span>
                      </div>
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

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-fade-in"
          onClick={() => setLightbox(null)}
        >
          <div className="relative max-w-5xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setLightbox(null)}
              className="absolute -top-10 right-0 text-stone-400 hover:text-white transition-colors cursor-pointer text-2xl"
            >
              ✕
            </button>
            <img
              src={lightbox.imageUrl}
              alt={lightbox.caption}
              className="w-full max-h-[80vh] object-contain rounded-lg"
            />
            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className="text-stone-200 text-lg" style={{ fontFamily: 'var(--font-handwriting)' }}>
                  {lightbox.caption}
                </p>
                <p className="text-stone-500 text-sm mt-1">
                  <span className="text-gold-500">{lightbox.tag}</span> • Uploaded by {lightbox.uploadedBy}
                </p>
              </div>
              {/* Delete button — owner or admin */}
              {user && (user.uid === lightbox.uploadedByUid || user.role === 'admin') && (
                <button
                  onClick={() => handleDelete(lightbox)}
                  className="px-4 py-2 bg-red-500/10 text-red-400 text-xs border border-red-500/30 rounded-lg hover:bg-red-500/20 transition-all cursor-pointer"
                >
                  🗑️ Delete
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUpload && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowUpload(false)}
        >
          <div
            className="w-full max-w-lg mx-4 rounded-2xl p-8 relative"
            style={{
              background: 'linear-gradient(145deg, #1c1a17, #1a1814)',
              border: '1px solid rgba(196, 164, 75, 0.3)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setShowUpload(false)}
              className="absolute top-5 right-5 text-stone-500 hover:text-stone-300 transition-colors cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>

            {/* Title */}
            <h3
              className="text-2xl md:text-3xl mb-6"
              style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--color-gold-500)' }}
            >
              Add to the Vault
            </h3>

            {/* Image preview / picker */}
            {uploadPreview ? (
              <div className="relative mb-5">
                <img src={uploadPreview} alt="Preview" className="w-full aspect-[4/3] object-cover rounded-lg" />
                <button
                  onClick={() => { setUploadFile(null); setUploadPreview(null) }}
                  className="absolute top-2 right-2 px-2 py-1 bg-black/70 text-stone-200 text-xs rounded-md hover:bg-red-500 transition-all cursor-pointer"
                >
                  ✕ Remove
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileRef.current?.click()}
                className="w-full aspect-[4/3] border-2 border-dashed border-stone-600 rounded-lg flex flex-col items-center justify-center text-stone-500 hover:border-gold-500 hover:text-gold-500 transition-all cursor-pointer mb-5"
              >
                <svg className="w-12 h-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="text-sm">Click to select a photo</span>
              </button>
            )}
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />

            {/* Caption */}
            <input
              type="text"
              value={uploadCaption}
              onChange={(e) => setUploadCaption(e.target.value)}
              placeholder="Add a caption / message *"
              className="w-full px-5 py-4 rounded-lg text-stone-100 placeholder-stone-500 focus:outline-none transition-all mb-4"
              style={{ background: '#1a1814', border: '1px solid #3d3930', fontSize: '0.95rem' }}
              onFocus={(e) => e.target.style.borderColor = 'var(--color-gold-500)'}
              onBlur={(e) => e.target.style.borderColor = '#3d3930'}
            />

            {/* Tag / Filter */}
            <div className="mb-6">
              <p className="text-stone-400 text-xs tracking-wider uppercase mb-2">Choose a category</p>
              <div className="flex flex-wrap gap-2">
                {tagOptions.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setUploadTag(tag)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                      uploadTag === tag
                        ? 'bg-gold-500 text-stone-900'
                        : 'bg-stone-800 border border-stone-700 text-stone-400 hover:border-stone-500'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleUpload}
              disabled={uploading || !uploadFile || !uploadCaption.trim()}
              className="w-full py-4 rounded-lg font-semibold text-base tracking-wide transition-all duration-300 cursor-pointer hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: 'var(--color-gold-500)', color: '#1a1814' }}
            >
              {uploading ? 'Uploading to Vault...' : '📸 Upload to Vault'}
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
