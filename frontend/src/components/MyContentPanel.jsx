import { useState, useEffect } from 'react'
import {
  getMyMediaItems,
  deleteMediaItem,
  updateMediaItem,
  getMyYearbookMessages,
  deleteYearbookMessage,
  getApprovedUsers,
} from '../firebase/firestore'

export default function MyContentPanel({ user, onClose, defaultTab = 'media' }) {
  const [activeTab, setActiveTab] = useState(defaultTab) // 'media' | 'yearbook'

  // Media state
  const [myMedia, setMyMedia] = useState([])
  const [mediaLoading, setMediaLoading] = useState(true)
  const [editingMedia, setEditingMedia] = useState(null) // media item being edited
  const [editCaption, setEditCaption] = useState('')

  // Yearbook state
  const [myMessages, setMyMessages] = useState([])
  const [messagesLoading, setMessagesLoading] = useState(true)
  const [students, setStudents] = useState([]) // to resolve toUid -> name

  // Lightbox for media
  const [lightbox, setLightbox] = useState(null)

  // Custom confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState(null)
  // confirmDialog = { title, message, icon, onConfirm, confirmLabel, confirmColor }

  // Fetch user's media
  useEffect(() => {
    if (!user) return
    fetchMyMedia()
  }, [user])

  // Fetch user's yearbook messages when tab switches
  useEffect(() => {
    if (activeTab === 'yearbook' && user && myMessages.length === 0 && messagesLoading) {
      fetchMyMessages()
    }
  }, [activeTab, user])

  const fetchMyMedia = async () => {
    setMediaLoading(true)
    try {
      const items = await getMyMediaItems(user.uid)
      setMyMedia(items)
    } catch (err) {
      console.error('Error fetching my media:', err)
    } finally {
      setMediaLoading(false)
    }
  }

  const fetchMyMessages = async () => {
    setMessagesLoading(true)
    try {
      const [msgs, users] = await Promise.all([
        getMyYearbookMessages(user.uid),
        getApprovedUsers(),
      ])
      setMyMessages(msgs)
      setStudents(users)
    } catch (err) {
      console.error('Error fetching my messages:', err)
    } finally {
      setMessagesLoading(false)
    }
  }

  const getStudentName = (uid) => {
    const s = students.find((st) => st.uid === uid)
    return s ? s.name : 'Unknown'
  }

  // =====================
  // Custom confirm helper
  // =====================
  const showConfirm = ({ title, message, icon, confirmLabel, onConfirm }) => {
    setConfirmDialog({ title, message, icon, confirmLabel, onConfirm })
  }

  const closeConfirm = () => setConfirmDialog(null)

  // Media handlers
  const handleDeleteMedia = (item) => {
    showConfirm({
      title: 'Delete Photo',
      message: 'This photo will be permanently removed from the vault. This action cannot be undone.',
      icon: 'photo',
      confirmLabel: 'Delete Photo',
      onConfirm: async () => {
        closeConfirm()
        try {
          await deleteMediaItem(item.id)
          setMyMedia((prev) => prev.filter((m) => m.id !== item.id))
          if (lightbox?.id === item.id) setLightbox(null)
        } catch (err) {
          alert('Error deleting: ' + err.message)
        }
      },
    })
  }

  const handleStartEdit = (item) => {
    setEditingMedia(item)
    setEditCaption(item.caption || '')
  }

  const handleSaveEdit = async () => {
    if (!editingMedia || !editCaption.trim()) return
    try {
      await updateMediaItem(editingMedia.id, { caption: editCaption.trim() })
      setMyMedia((prev) =>
        prev.map((m) => (m.id === editingMedia.id ? { ...m, caption: editCaption.trim() } : m))
      )
      setEditingMedia(null)
      setEditCaption('')
    } catch (err) {
      alert('Error updating: ' + err.message)
    }
  }

  // Yearbook message handlers
  const handleDeleteMessage = (msg) => {
    showConfirm({
      title: 'Delete Message',
      message: `Your message to ${getStudentName(msg.toUid)} will be permanently deleted.`,
      icon: 'message',
      confirmLabel: 'Delete Message',
      onConfirm: async () => {
        closeConfirm()
        try {
          await deleteYearbookMessage(msg.id)
          setMyMessages((prev) => prev.filter((m) => m.id !== msg.id))
        } catch (err) {
          alert('Error deleting: ' + err.message)
        }
      },
    })
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return ''
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl mx-3 sm:mx-4 max-h-[88vh] flex flex-col rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #1e1c18, #151310)',
          border: '1px solid rgba(196, 164, 75, 0.15)',
          boxShadow: '0 30px 80px rgba(0,0,0,0.7), 0 0 60px rgba(196,164,75,0.03)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top accent line */}
        <div
          className="h-[2px] w-full flex-shrink-0"
          style={{ background: 'linear-gradient(90deg, transparent, var(--color-gold-500), transparent)' }}
        />

        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-7 pt-5 pb-3 flex-shrink-0">
          <div>
            <h2
              className="text-2xl sm:text-3xl"
              style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--color-gold-500)' }}
            >
              My Collection
            </h2>
            <p className="text-stone-500 text-xs mt-1">Manage your photos and messages</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-stone-800/60 text-stone-400 hover:text-stone-200 hover:bg-stone-700/80 transition-all cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 px-5 sm:px-7 pb-4 flex-shrink-0">
          <button
            onClick={() => setActiveTab('media')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer ${
              activeTab === 'media'
                ? 'bg-gold-500/15 text-gold-500 border border-gold-500/30'
                : 'text-stone-400 hover:text-stone-200 border border-transparent hover:bg-stone-800/50'
            }`}
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              My Photos
              {!mediaLoading && <span className="text-[10px] opacity-70">({myMedia.length})</span>}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('yearbook')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer ${
              activeTab === 'yearbook'
                ? 'bg-gold-500/15 text-gold-500 border border-gold-500/30'
                : 'text-stone-400 hover:text-stone-200 border border-transparent hover:bg-stone-800/50'
            }`}
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              My Messages
              {!messagesLoading && activeTab === 'yearbook' && <span className="text-[10px] opacity-70">({myMessages.length})</span>}
            </span>
          </button>
        </div>

        {/* Divider */}
        <div className="mx-5 sm:mx-7 border-t border-stone-800/60 flex-shrink-0" />

        {/* Content — scrollable */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-7 py-5 no-scrollbar">

          {/* =============================== */}
          {/* MY PHOTOS TAB */}
          {/* =============================== */}
          {activeTab === 'media' && (
            <>
              {mediaLoading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="text-center">
                    <div className="w-8 h-8 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-stone-500 text-sm">Loading your photos...</p>
                  </div>
                </div>
              ) : myMedia.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'rgba(196,164,75,0.06)', border: '1px solid rgba(196,164,75,0.1)' }}>
                    <svg className="w-8 h-8 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-stone-400 text-sm font-medium">No photos uploaded yet</p>
                  <p className="text-stone-600 text-xs mt-1">Your Media Vault uploads will appear here</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {myMedia.map((item) => (
                    <div
                      key={item.id}
                      className="group relative rounded-xl overflow-hidden bg-stone-800 cursor-pointer"
                      onClick={() => setLightbox(item)}
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.caption}
                        className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 p-3">
                        {item.monthYear && (
                          <span className="text-gold-500 text-[10px] tracking-wider uppercase font-semibold">
                            {item.monthYear}
                          </span>
                        )}
                        <p className="text-stone-200 text-xs text-center line-clamp-2" style={{ fontFamily: 'var(--font-handwriting)' }}>
                          {item.caption}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleStartEdit(item) }}
                            className="px-2.5 py-1 bg-stone-700/80 text-stone-200 text-[10px] rounded-md hover:bg-gold-500 hover:text-stone-900 transition-all cursor-pointer font-medium"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDeleteMedia(item) }}
                            className="px-2.5 py-1 bg-stone-700/80 text-red-400 text-[10px] rounded-md hover:bg-red-500 hover:text-white transition-all cursor-pointer font-medium"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>

                      {/* Bottom tag */}
                      <div className="absolute bottom-0 left-0 right-0 px-2.5 py-2 bg-gradient-to-t from-black/80 to-transparent">
                        <p className="text-stone-300 text-[10px] truncate">{item.caption}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* =============================== */}
          {/* MY YEARBOOK MESSAGES TAB */}
          {/* =============================== */}
          {activeTab === 'yearbook' && (
            <>
              {messagesLoading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="text-center">
                    <div className="w-8 h-8 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-stone-500 text-sm">Loading your messages...</p>
                  </div>
                </div>
              ) : myMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'rgba(196,164,75,0.06)', border: '1px solid rgba(196,164,75,0.1)' }}>
                    <svg className="w-8 h-8 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <p className="text-stone-400 text-sm font-medium">No yearbook messages sent</p>
                  <p className="text-stone-600 text-xs mt-1">Messages you write in classmates' yearbooks will appear here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {myMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className="group bg-stone-900/60 border border-stone-800/60 rounded-xl p-4 hover:border-stone-700/60 transition-all"
                    >
                      {/* Message content */}
                      <p
                        className="text-stone-200 mb-3 leading-relaxed"
                        style={{ fontFamily: 'var(--font-handwriting)', fontSize: '1.05rem' }}
                      >
                        "{msg.text}"
                      </p>

                      {/* Meta row */}
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-stone-500 text-xs">
                            To <span className="text-gold-500 font-medium">{getStudentName(msg.toUid)}</span>
                          </span>
                          <span className="text-stone-700 text-xs">•</span>
                          <span className="text-stone-600 text-xs">{formatDate(msg.createdAt)}</span>
                        </div>
                        <button
                          onClick={() => handleDeleteMessage(msg)}
                          className="px-3 py-1.5 bg-red-500/8 text-red-400 text-[11px] border border-red-500/20 rounded-lg hover:bg-red-500/20 hover:border-red-500/40 transition-all cursor-pointer font-medium opacity-0 group-hover:opacity-100"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* =============================== */}
      {/* Media Lightbox (within panel) */}
      {/* =============================== */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-fade-in"
          onClick={() => setLightbox(null)}
        >
          <div className="relative max-w-4xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setLightbox(null)}
              className="absolute -top-10 right-0 text-stone-400 hover:text-white transition-colors cursor-pointer text-2xl"
            >
              ✕
            </button>
            <img
              src={lightbox.imageUrl}
              alt={lightbox.caption}
              className="w-full max-h-[75vh] object-contain rounded-lg"
            />
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-stone-200 text-lg" style={{ fontFamily: 'var(--font-handwriting)' }}>
                  {lightbox.caption}
                </p>
                <p className="text-stone-500 text-sm mt-1">
                  <span className="text-gold-500">{lightbox.tag}</span>
                  {lightbox.monthYear && <> • <span className="text-stone-400">{lightbox.monthYear}</span></>}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { handleStartEdit(lightbox); setLightbox(null) }}
                  className="px-4 py-2 bg-gold-500/10 text-gold-500 text-xs border border-gold-500/30 rounded-lg hover:bg-gold-500/20 transition-all cursor-pointer"
                >
                  ✏️ Edit Caption
                </button>
                <button
                  onClick={() => handleDeleteMedia(lightbox)}
                  className="px-4 py-2 bg-red-500/10 text-red-400 text-xs border border-red-500/30 rounded-lg hover:bg-red-500/20 transition-all cursor-pointer"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =============================== */}
      {/* Edit Caption Modal */}
      {/* =============================== */}
      {editingMedia && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in"
          onClick={() => setEditingMedia(null)}
        >
          <div
            className="w-full max-w-md mx-4 rounded-2xl p-6 sm:p-7"
            style={{
              background: 'linear-gradient(160deg, #1e1c18, #151310)',
              border: '1px solid rgba(196, 164, 75, 0.2)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h4
              className="text-xl mb-1"
              style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--color-gold-500)' }}
            >
              Edit Caption
            </h4>
            <p className="text-stone-500 text-xs mb-5">Update the caption for this memory</p>

            {/* Preview thumbnail */}
            <div className="flex items-center gap-3 mb-5 p-3 rounded-xl bg-stone-900/60 border border-stone-800/60">
              <img
                src={editingMedia.imageUrl}
                alt=""
                className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
              />
              <div className="min-w-0">
                <p className="text-stone-400 text-xs truncate">{editingMedia.tag}</p>
                {editingMedia.monthYear && (
                  <p className="text-stone-500 text-[10px]">{editingMedia.monthYear}</p>
                )}
              </div>
            </div>

            <input
              type="text"
              value={editCaption}
              onChange={(e) => setEditCaption(e.target.value)}
              placeholder="Enter new caption..."
              maxLength={120}
              className="w-full px-4 py-3.5 rounded-xl text-stone-100 placeholder-stone-600 focus:outline-none transition-all text-sm mb-1"
              style={{ background: 'rgba(26,24,20,0.8)', border: '1px solid #3d3930' }}
              onFocus={(e) => e.target.style.borderColor = 'var(--color-gold-500)'}
              onBlur={(e) => e.target.style.borderColor = '#3d3930'}
              autoFocus
            />
            <p className="text-stone-600 text-[10px] text-right mb-5">{editCaption.length}/120</p>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setEditingMedia(null)}
                className="flex-1 py-3 rounded-xl text-sm font-medium text-stone-400 bg-stone-800/60 border border-stone-700/50 hover:bg-stone-700/60 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={!editCaption.trim()}
                className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: 'var(--color-gold-500)', color: '#1a1814' }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =============================== */}
      {/* Custom Confirmation Dialog */}
      {/* =============================== */}
      {confirmDialog && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in"
          onClick={closeConfirm}
        >
          <div
            className="w-full max-w-sm mx-4 rounded-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(160deg, #1e1c18, #151310)',
              border: '1px solid rgba(239, 68, 68, 0.15)',
              boxShadow: '0 25px 60px rgba(0,0,0,0.6), 0 0 40px rgba(239,68,68,0.04)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top red accent */}
            <div
              className="h-[2px] w-full"
              style={{ background: 'linear-gradient(90deg, transparent, #ef4444, transparent)' }}
            />

            <div className="p-6 sm:p-7">
              {/* Icon */}
              <div className="flex justify-center mb-5">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}
                >
                  {confirmDialog.icon === 'photo' ? (
                    <svg className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  ) : (
                    <svg className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  )}
                </div>
              </div>

              {/* Title */}
              <h4
                className="text-center text-lg font-semibold mb-2 text-stone-100"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                {confirmDialog.title}
              </h4>

              {/* Message */}
              <p className="text-center text-stone-400 text-sm leading-relaxed mb-6">
                {confirmDialog.message}
              </p>

              {/* Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={closeConfirm}
                  className="flex-1 py-3 rounded-xl text-sm font-medium text-stone-400 bg-stone-800/60 border border-stone-700/50 hover:bg-stone-700/60 hover:text-stone-200 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDialog.onConfirm}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-all cursor-pointer hover:brightness-110"
                  style={{
                    background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                    boxShadow: '0 4px 14px rgba(239,68,68,0.25)',
                  }}
                >
                  {confirmDialog.confirmLabel}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
