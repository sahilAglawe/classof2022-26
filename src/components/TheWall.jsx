import { useState } from 'react'

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

const initialMessages = [
  {
    text: 'Miss you guyss 😭❤️',
    author: 'Sneha G.',
    color: 0,
  },
  {
    text: "Never forget this good old daysss. From first bench to last bench partners, we've come a long way.",
    author: 'Rohit S.',
    color: 1,
  },
  {
    text: "Four years went by like four months. I'm not crying, you're crying. 🥹",
    author: 'Anonymous',
    color: 2,
  },
  {
    text: 'To everyone who shared their notes before exams — you are the real MVPs. 📝',
    author: 'Aditya J.',
    color: 3,
  },
  {
    text: "The canteen chai hits different when you know it's the last one. See you on the other side, batch!",
    author: 'Kavya M.',
    color: 4,
  },
  {
    text: "Thank you for making college feel like home. I wouldn't trade these memories for anything in the world.",
    author: 'Priya P.',
    color: 5,
  },
  {
    text: 'Hall B will always be our Hall B. 😤💪',
    author: 'Arjun V.',
    color: 6,
  },
  {
    text: "From strangers to family, this batch gave me memories I'll carry everywhere. Goodbye isn't forever. 💛",
    author: 'Neha T.',
    color: 7,
  },
  {
    text: 'Remember the viva where nobody knew the answer and we all just vibed? Good times. 😂',
    author: 'Vikash S.',
    color: 0,
  },
  {
    text: "Bittersweet doesn't even begin to describe this. We made it, fam! 🎓",
    author: 'Divya S.',
    color: 1,
  },
  {
    text: 'The hostel late night conversations > everything else. Miss those 3 AM chai runs.',
    author: 'Mohit Y.',
    color: 2,
  },
  {
    text: "Can't believe it's over. These were the best years of my life and I didn't even realize it while living them.",
    author: 'Rajat K.',
    color: 3,
  },
]

export default function TheWall() {
  const [messages, setMessages] = useState(initialMessages)
  const [showForm, setShowForm] = useState(false)
  const [newMsg, setNewMsg] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [visibleCount, setVisibleCount] = useState(8)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!newMsg.trim()) return
    setMessages([
      {
        text: newMsg,
        author: newAuthor.trim() || 'Anonymous',
        color: Math.floor(Math.random() * noteColors.length),
      },
      ...messages,
    ])
    setNewMsg('')
    setNewAuthor('')
    setShowForm(false)
  }

  return (
    <section className="py-16 md:py-24 relative">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 border border-gold-500 text-gold-500 text-xs tracking-widest uppercase font-medium rounded-full mb-6">
            Final Goodbyes
          </span>
          <h2
            className="text-4xl md:text-5xl font-bold text-stone-100 mb-4"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Message Wall of Reflection
          </h2>
          <p className="text-stone-400 text-lg max-w-xl mx-auto">
            Leave your final words, wishes, and memories for the batch.
          </p>
        </div>

        {/* Sticky Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {messages.slice(0, visibleCount).map((msg, i) => (
            <div
              key={i}
              className={`sticky-note ${noteColors[msg.color]}`}
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <p className="mb-3 leading-relaxed">{msg.text}</p>
              <p className="text-sm opacity-70 font-sans font-medium">— {msg.author}</p>
            </div>
          ))}
        </div>

        {/* Load More */}
        {visibleCount < messages.length && (
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
        className="fixed bottom-8 right-8 z-30 w-14 h-14 bg-gold-500 hover:bg-gold-600 text-stone-900 rounded-full shadow-lg shadow-gold-500/20 flex items-center justify-center text-2xl transition-all duration-300 hover:scale-110 cursor-pointer"
        title="Write a Message"
      >
        ✍️
      </button>

      {/* Write Message Modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowForm(false)}
        >
          <div
            className="bg-stone-900 border border-stone-700 rounded-lg p-8 w-full max-w-md mx-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowForm(false)}
              className="float-right text-stone-500 hover:text-stone-200 transition-colors cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>

            <h3
              className="text-2xl font-bold text-stone-100 mb-6"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Write a Message ✉️
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-300 mb-1.5">
                  Your Name (optional)
                </label>
                <input
                  type="text"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  placeholder="Anonymous"
                  className="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-md text-stone-100 placeholder-stone-500 focus:outline-none focus:border-gold-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-300 mb-1.5">
                  Your Message
                </label>
                <textarea
                  value={newMsg}
                  onChange={(e) => setNewMsg(e.target.value)}
                  placeholder="Share your memories, wishes, or final words..."
                  rows={4}
                  className="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-md text-stone-100 placeholder-stone-500 focus:outline-none focus:border-gold-500 transition-colors resize-none"
                  style={{ fontFamily: 'var(--font-handwriting)', fontSize: '1.05rem' }}
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-gold-500 hover:bg-gold-600 text-stone-900 font-semibold rounded-md transition-colors cursor-pointer"
              >
                Post to the Wall
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}
