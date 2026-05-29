import { useState, useEffect } from 'react'

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

const MOCK_MESSAGES = [
  { id: '1', text: 'This was the best 4 years of my life! I will miss you all.', author: 'Aarav', color: 0 },
  { id: '2', text: 'Good luck to everyone in their future endeavors!', author: 'Priya', color: 1 },
  { id: '3', text: 'Those late night maggi sessions in the hostel ❤️', author: 'Rahul', color: 2 },
  { id: '4', text: "Can't believe it's over. Batch of 26 rocks!", author: 'Sneha', color: 3 },
  { id: '5', text: 'To all the professors who tolerated us... thank you.', author: 'Karan', color: 4 },
  { id: '6', text: 'Going to miss the campus so much. Adios!', author: 'Ananya', color: 5 },
  { id: '7', text: 'Will never forget the Aura fest!', author: 'Anonymous', color: 6 },
  { id: '8', text: 'Stay in touch everyone!', author: 'Rohan', color: 7 },
  { id: '9', text: 'I am going to miss the library sleep sessions.', author: 'Aditi', color: 0 },
]

export default function TheWall() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [visibleCount, setVisibleCount] = useState(8)

  // Fetch messages (mocked)
  useEffect(() => {
    const fetchMessages = () => {
      setLoading(true)
      setTimeout(() => {
        setMessages(MOCK_MESSAGES)
        setLoading(false)
      }, 500)
    }
    fetchMessages()
  }, [])

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
    </section>
  )
}
