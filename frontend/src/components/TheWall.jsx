import { useState, useEffect } from 'react'
import { getWallMessages, addWallMessage, deleteWallMessage } from '../firebase/firestore'

const noteColors = [
  'bg-amber-100 text-amber-900',
  'bg-rose-100 text-rose-900',
  'bg-sky-100 text-sky-900',
  'bg-lime-100 text-lime-900',
  'bg-purple-100 text-purple-900',
  'bg-orange-100 text-orange-900',
  'bg-teal-100 text-teal-900',
  'bg-pink-100 text-pink-900',
]

export default function TheWall({ user, isAdmin }) {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [newMsg, setNewMsg] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [anonymous, setAnonymous] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [visibleCount, setVisibleCount] = useState(8)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)


  // Fetch messages from Firestore on mount
  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    setLoading(true)
    try {
      const msgs = await getWallMessages()
      setMessages(msgs)
    } catch (err) {
      console.error('Error fetching wall messages:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!newMsg.trim()) return
    setSubmitting(true)
    try {
      const author = anonymous ? 'Anonymous' : (newAuthor.trim() || (user ? user.name : 'Anonymous'))
      const color = Math.floor(Math.random() * noteColors.length)
      await addWallMessage({
        text: newMsg.trim(),
        author,
        color,
      })
      // Refresh messages from Firestore
      await fetchMessages()
      setNewMsg('')
      setNewAuthor('')
      setAnonymous(false)
      setShowForm(false)
      setVisibleCount((prev) => Math.max(prev, 8))
    } catch (err) {
      alert('Error posting message: ' + err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteWallMessage(deleteTarget)
      await fetchMessages()
    } catch (err) {
      console.error('Error deleting message:', err)
    } finally {
      setDeleting(false)
      setDeleteTarget(null)
    }
  }

  return (
    <section className="py-12 sm:py-16 md:py-24 relative" style={{ background: 'linear-gradient(180deg, #0c1220 0%, #111827 40%, #0f172a 100%)' }}>
      <div className="px-4 sm:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 bg-gold-500/10 border border-gold-500/40 text-gold-500 text-[10px] sm:text-xs tracking-widest uppercase font-medium rounded-full mb-4 sm:mb-6">
            🧡 Final Goodbyes
          </span>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-stone-100 mb-4 sm:mb-5"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Message Wall of Reflection
          </h2>
          <p className="text-stone-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed px-2">
            A space to leave your final words, memories, and wishes. These notes
            will remain here as a testament to our journey.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-16">
            <p className="text-stone-500 text-lg">Loading messages...</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && messages.length === 0 && (
          <div className="text-center py-16">
            <p className="text-stone-500 text-lg">No messages yet. Be the first to leave a note!</p>
          </div>
        )}

        {/* Sticky Notes Grid */}
        {!loading && messages.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {messages.slice(0, visibleCount).map((msg, i) => (
              <div
                key={msg.id || i}
                className={`sticky-note ${noteColors[msg.color || 0]} relative group`}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {isAdmin && (
                  <button
                    onClick={() => setDeleteTarget(msg.id)}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer hover:bg-red-500/20 text-red-500"
                    title="Delete message"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
                <p className="mb-3 leading-relaxed">{msg.text}</p>
                <p className="text-sm opacity-70 font-sans font-medium">— {msg.author}</p>
              </div>
            ))}
          </div>
        )}

        {/* Load More */}
        {!loading && visibleCount < messages.length && (
          <div className="text-center mt-10">
            <button
              onClick={() => setVisibleCount((prev) => prev + 4)}
              className="px-6 py-3 border border-stone-600 text-stone-400 text-sm tracking-widest uppercase font-medium rounded-full hover:border-gold-500 hover:text-gold-500 transition-all duration-300 cursor-pointer"
            >
              Load More Messages
            </button>
          </div>
        )}
      </div>

      {/* Floating Write Button */}
      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-5 right-4 sm:bottom-8 sm:right-8 z-30 px-4 sm:px-6 py-2.5 sm:py-3 bg-gold-500 hover:bg-gold-600 text-stone-900 rounded-full shadow-lg shadow-gold-500/20 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300 hover:scale-105 cursor-pointer"
      >
        ✉️ <span className="hidden xs:inline">Write a </span>Message
      </button>

      {/* Write Message Modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowForm(false)}
        >
          <div
            className="rounded-2xl p-5 sm:p-8 w-full max-w-lg mx-3 sm:mx-4 shadow-2xl relative"
            style={{ background: '#faf8f5' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-6 right-6 text-stone-400 hover:text-stone-600 transition-colors cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>

            {/* Title */}
            <h3
              className="text-2xl sm:text-3xl mb-5 sm:mb-8"
              style={{ fontFamily: 'var(--font-handwriting)', color: '#2d2a26' }}
            >
              Leave a Note...
            </h3>

            <form onSubmit={handleSubmit}>
              {/* Message textarea */}
              <textarea
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                placeholder="I'll never forget..."
                rows={4}
                className="w-full bg-transparent border-none outline-none resize-none text-lg mb-4"
                style={{
                  fontFamily: 'var(--font-handwriting)',
                  fontSize: '1.1rem',
                  color: '#2d2a26',
                  borderBottom: '1px solid #d4d0ca',
                  paddingBottom: '1rem',
                }}
              />

              {/* Name input */}
              <input
                type="text"
                value={anonymous ? '' : newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
                placeholder={user ? `Your Name (default: ${user.name})` : 'Your Name (Optional)'}
                disabled={anonymous}
                className="w-full bg-transparent border-none outline-none py-3 text-lg"
                style={{
                  fontFamily: 'var(--font-handwriting)',
                  color: anonymous ? '#b5b0a8' : '#2d2a26',
                  borderBottom: '1px solid #d4d0ca',
                  opacity: anonymous ? 0.5 : 1,
                }}
              />

              {/* Anonymous checkbox */}
              <label className="flex items-center gap-3 mt-5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={anonymous}
                  onChange={(e) => {
                    setAnonymous(e.target.checked)
                    if (e.target.checked) setNewAuthor('')
                  }}
                  className="w-5 h-5 rounded border-2 accent-stone-800 cursor-pointer"
                  style={{ borderColor: '#c4c0b8' }}
                />
                <span
                  className="text-base"
                  style={{ color: '#5a564e', fontFamily: 'var(--font-handwriting)' }}
                >
                  Keep it mysterious (Post Anonymously)
                </span>
              </label>

              {/* Submit button */}
              <div className="flex justify-end mt-8">
                <button
                  type="submit"
                  disabled={submitting || !newMsg.trim()}
                  className="px-8 py-3 rounded-full text-white font-semibold text-sm tracking-wide transition-all duration-300 hover:scale-105 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  style={{ background: '#1a1a1a' }}
                >
                  {submitting ? 'Posting...' : 'Pin to Wall'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in"
          onClick={() => setDeleteTarget(null)}
        >
          <div
            className="rounded-2xl p-6 sm:p-8 w-full max-w-sm mx-4 shadow-2xl text-center"
            style={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-stone-100 mb-2">Delete Message?</h3>
            <p className="text-stone-400 text-sm mb-6">This action cannot be undone. The message will be permanently removed from the wall.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 px-4 py-2.5 rounded-full border border-stone-600 text-stone-300 text-sm font-medium hover:border-stone-400 transition-all duration-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 rounded-full bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-all duration-200 cursor-pointer disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
