import { useState } from 'react'

const students = [
  { name: 'Aaliya Khan', uid: '0187CS221002', avatar: '/images/students.png' },
  { name: 'Rohit Sharma', uid: '0187CS221015', avatar: '/images/students.png' },
  { name: 'Priya Patel', uid: '0187CS221008', avatar: '/images/students.png' },
  { name: 'Arjun Verma', uid: '0187CS221023', avatar: '/images/students.png' },
  { name: 'Sneha Gupta', uid: '0187CS221042', avatar: '/images/students.png' },
  { name: 'Vikash Singh', uid: '0187CS221005', avatar: '/images/students.png' },
  { name: 'Neha Tiwari', uid: '0187CS221019', avatar: '/images/students.png' },
  { name: 'Aditya Joshi', uid: '0187CS221011', avatar: '/images/students.png' },
  { name: 'Kavya Mishra', uid: '0187CS221007', avatar: '/images/students.png' },
  { name: 'Rajat Kumar', uid: '0187CS221033', avatar: '/images/students.png' },
  { name: 'Divya Saxena', uid: '0187CS221014', avatar: '/images/students.png' },
  { name: 'Mohit Yadav', uid: '0187CS221009', avatar: '/images/students.png' },
]

const majors = ['All Majors', 'CSE', 'CSE(AIDS)', 'CSE(CYBER)', 'MECH', 'CIVIL', 'EC', 'EX']

export default function Yearbook() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All Majors')
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [message, setMessage] = useState('')
  const [visibleCount, setVisibleCount] = useState(8)
  // Store messages per student UID: { [uid]: [{ text, author, date }] }
  const [studentMessages, setStudentMessages] = useState({})

  const filtered = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.uid.toLowerCase().includes(search.toLowerCase())
    const matchesMajor = filter === 'All Majors' || filter === 'CSE'
    return matchesSearch && matchesMajor
  })

  const handleSendMessage = () => {
    if (!message.trim() || !selectedStudent) return
    const newMsg = {
      text: message.trim(),
      author: 'Anonymous',
      date: new Date().toLocaleDateString(),
    }
    setStudentMessages((prev) => ({
      ...prev,
      [selectedStudent.uid]: [...(prev[selectedStudent.uid] || []), newMsg],
    }))
    setMessage('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <section className="min-h-screen">
      {/* Header area — slightly lighter to separate from navbar */}
      <div className="bg-stone-950 pt-10 pb-14">
        <div className="px-8 text-center">
          <h2
            className="text-6xl md:text-7xl lg:text-8xl text-stone-100 mb-5"
            style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontWeight: 400,
            }}
          >
            The Class of '26
          </h2>
          <p className="text-stone-400 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Faces that defined our journey. Moments that became memories.
            Click a card to sign their yearbook.
          </p>
        </div>
      </div>

      {/* Content area — distinct darker background */}
      <div className="bg-stone-950 py-10">
        <div className="px-8">
          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-10">
            <div className="flex-1 relative">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-500"
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Find a classmate..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-stone-900 border border-stone-700 rounded-lg text-stone-100 placeholder-stone-500 focus:outline-none focus:border-gold-500 transition-colors"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {majors.map((m) => (
                <button
                  key={m}
                  onClick={() => setFilter(m)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${
                    filter === m
                      ? 'bg-gold-500 text-stone-900'
                      : 'bg-stone-900 border border-stone-700 text-stone-400 hover:border-stone-400 hover:text-stone-200'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-stone-700 mb-10"></div>

          {/* Student Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.slice(0, visibleCount).map((student, i) => (
              <div
                key={i}
                onClick={() => setSelectedStudent(student)}
                className="student-card group bg-stone-900 border border-stone-800 rounded-lg overflow-hidden cursor-pointer hover:border-gold-500/30 hover:bg-stone-850 transition-all duration-300 hover:shadow-lg hover:shadow-gold-500/5"
              >
              <div className="relative aspect-square overflow-hidden bg-stone-800">
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Hover overlay with button */}
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="px-4 py-2 bg-gold-500 text-stone-900 text-xs font-semibold tracking-[0.15em] uppercase rounded-sm">
                      Open Yearbook
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3
                    className="text-stone-100 font-semibold text-sm mb-1 group-hover:text-gold-500 transition-colors"
                    style={{ fontFamily: 'var(--font-serif)' }}
                  >
                    {student.name}
                  </h3>
                  <p className="text-stone-500 text-xs">CSE</p>
                  <p className="text-stone-600 text-xs mt-1 font-mono">{student.uid}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          {visibleCount < filtered.length && (
            <div className="text-center mt-12">
              <button
                onClick={() => setVisibleCount((prev) => prev + 8)}
                className="px-8 py-3 border border-stone-600 text-stone-400 text-sm tracking-[0.2em] uppercase font-medium rounded-sm hover:border-gold-500 hover:text-gold-500 transition-all duration-300 cursor-pointer"
              >
                Load More Classmates
              </button>
            </div>
          )}

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-stone-500 text-lg">No classmates found matching your search.</p>
            </div>
          )}
        </div>
      </div>

      {/* Student Detail Modal */}
      {selectedStudent && (() => {
        const currentIndex = filtered.indexOf(selectedStudent)
        const prevStudent = currentIndex > 0 ? filtered[currentIndex - 1] : null
        const nextStudent = currentIndex < filtered.length - 1 ? filtered[currentIndex + 1] : null
        const messages = studentMessages[selectedStudent.uid] || []

        return (
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 backdrop-blur-md animate-fade-in"
            onClick={() => setSelectedStudent(null)}
          >
            {/* Prev arrow */}
            {prevStudent && (
              <button
                onClick={(e) => { e.stopPropagation(); setSelectedStudent(prevStudent) }}
                className="absolute left-4 md:left-8 z-10 w-12 h-12 flex items-center justify-center text-stone-400 hover:text-gold-500 transition-colors cursor-pointer"
              >
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            {/* Next arrow */}
            {nextStudent && (
              <button
                onClick={(e) => { e.stopPropagation(); setSelectedStudent(nextStudent) }}
                className="absolute right-4 md:right-8 z-10 w-12 h-12 flex items-center justify-center text-stone-400 hover:text-gold-500 transition-colors cursor-pointer"
              >
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}

            {/* Modal content */}
            <div
              className="flex flex-col md:flex-row w-full max-w-4xl max-h-[85vh] mx-4 rounded-xl overflow-hidden shadow-2xl border border-stone-800"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Left — Photo */}
              <div className="relative w-full md:w-1/2 bg-stone-900 flex-shrink-0">
                <img
                  src={selectedStudent.avatar}
                  alt={selectedStudent.name}
                  className="w-full h-64 md:h-full object-cover grayscale"
                />
                {/* Name overlay at bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                  <h3
                    className="text-2xl md:text-3xl font-bold text-stone-100 mb-1"
                    style={{ fontFamily: 'var(--font-serif)' }}
                  >
                    {selectedStudent.name}
                  </h3>
                  <p className="text-sm">
                    <span className="text-gold-500 font-semibold tracking-wide">CSE</span>
                    <span className="text-stone-400 mx-2">|</span>
                    <span className="text-stone-400 font-mono text-xs">{selectedStudent.uid}</span>
                  </p>
                </div>
              </div>

              {/* Right — Messages panel */}
              <div className="w-full md:w-1/2 bg-stone-950 flex flex-col max-h-[85vh]">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-stone-800">
                  <div>
                    <p className="text-stone-500 text-xs mb-1" style={{ fontFamily: 'var(--font-handwriting)' }}>///</p>
                    <h4 className="text-stone-200 text-sm font-semibold tracking-wide">
                      Messages from the Batch
                    </h4>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 border border-stone-700 text-stone-500 text-xs tracking-wider uppercase rounded-sm">
                      {messages.length} {messages.length === 1 ? 'Reply' : 'Replies'}
                    </span>
                    <button
                      onClick={() => setSelectedStudent(null)}
                      className="text-stone-500 hover:text-stone-200 transition-colors cursor-pointer"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Messages list */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar">
                  {messages.length === 0 ? (
                    /* Empty state — shown when no messages exist */
                    <div className="flex flex-col items-center justify-center h-full text-center py-12">
                      <p
                        className="text-stone-500 italic text-lg leading-relaxed"
                        style={{ fontFamily: 'var(--font-handwriting)' }}
                      >
                        No signatures yet.
                      </p>
                      <p
                        className="text-stone-600 italic text-base mt-1"
                        style={{ fontFamily: 'var(--font-handwriting)' }}
                      >
                        Be the first to leave a memory.
                      </p>
                    </div>
                  ) : (
                    /* Render actual messages */
                    messages.map((msg, idx) => (
                      <div key={idx} className="bg-stone-900/80 border border-stone-800 rounded-lg p-4">
                        <p
                          className="text-stone-200 mb-2 leading-relaxed"
                          style={{ fontFamily: 'var(--font-handwriting)', fontSize: '1.1rem' }}
                        >
                          {msg.text}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-stone-500 text-xs">— {msg.author}</span>
                          <span className="text-stone-600 text-xs">{msg.date}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Message input */}
                <div className="p-5 border-t border-stone-800">
                  <div className="relative">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Write a farewell message..."
                      className="w-full px-4 py-3 pr-12 bg-stone-900 border border-stone-800 rounded-lg text-stone-100 placeholder-stone-600 focus:outline-none focus:border-gold-500 transition-colors resize-none"
                      rows={2}
                      style={{ fontFamily: 'var(--font-handwriting)', fontSize: '1.05rem' }}
                    />
                    <button
                      onClick={handleSendMessage}
                      className="absolute bottom-3 right-3 w-8 h-8 flex items-center justify-center text-gold-500 hover:text-gold-400 transition-colors cursor-pointer"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })()}
    </section>
  )
}
