import { useState, useEffect } from 'react'
import { getWallMessages, addWallMessage } from '../firebase/firestore'

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

export default function TheWall({ user }) {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [newMsg, setNewMsg] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [anonymous, setAnonymous] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [visibleCount, setVisibleCount] = useState(8)

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

  return (
    <section className="py-16 md:py-24 relative" style={{ background: 'linear-gradient(180deg, #0c1220 0%, #111827 40%, #0f172a 100%)' }}>
      <div className="px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-gold-500/10 border border-gold-500/40 text-gold-500 text-xs tracking-widest uppercase font-medium rounded-full mb-6">
            🧡 Final Goodbyes
          </span>
          <h2
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-stone-100 mb-5"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Message Wall of Reflection
          </h2>
          <p className="text-stone-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {messages.slice(0, visibleCount).map((msg, i) => (
              <div
                key={msg.id || i}
                className={`sticky-note ${noteColors[msg.color || 0]}`}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
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
        className="fixed bottom-8 right-8 z-30 px-6 py-3 bg-gold-500 hover:bg-gold-600 text-stone-900 rounded-full shadow-lg shadow-gold-500/20 flex items-center gap-2 text-sm font-semibold tracking-wide transition-all duration-300 hover:scale-105 cursor-pointer"
      >
        ✉️ Write a Message
      </button>

      {/* Write Message Modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowForm(false)}
        >
          <div
            className="rounded-2xl p-8 w-full max-w-lg mx-4 shadow-2xl relative"
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
              className="text-3xl mb-8"
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
                rows={6}
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
    </section>
  )
}
