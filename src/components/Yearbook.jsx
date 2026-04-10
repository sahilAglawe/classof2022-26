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

  const filtered = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.uid.toLowerCase().includes(search.toLowerCase())
    const matchesMajor = filter === 'All Majors' || filter === 'CSE'
    return matchesSearch && matchesMajor
  })

  return (
    <section className="min-h-screen">
      {/* Header area — slightly lighter to separate from navbar */}
      <div className="bg-stone-950 pt-10 pb-14">
        <div className="max-w-6xl mx-auto px-6 text-center">
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
        <div className="max-w-6xl mx-auto px-6">
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

          {/* Student Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.slice(0, visibleCount).map((student, i) => (
              <div
                key={i}
                onClick={() => setSelectedStudent(student)}
                className="student-card group bg-stone-900 border border-stone-800 rounded-lg overflow-hidden cursor-pointer hover:border-gold-500/30 hover:bg-stone-850 transition-all duration-300 hover:shadow-lg hover:shadow-gold-500/5"
              >
                <div className="aspect-square overflow-hidden bg-stone-800">
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
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
      {selectedStudent && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedStudent(null)}
        >
          <div
            className="bg-stone-900 border border-stone-700 rounded-lg p-8 w-full max-w-lg mx-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedStudent(null)}
              className="float-right text-stone-500 hover:text-stone-200 transition-colors cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-stone-700 flex-shrink-0">
                <img src={selectedStudent.avatar} alt={selectedStudent.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-stone-100" style={{ fontFamily: 'var(--font-serif)' }}>
                  {selectedStudent.name}
                </h3>
                <p className="text-stone-400 text-sm">CSE • {selectedStudent.uid}</p>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-stone-300 text-sm font-semibold mb-3 tracking-wide uppercase">
                Messages from the Batch
              </h4>
              <div className="bg-stone-800/50 rounded-lg p-4 mb-4 min-h-[80px]">
                <p className="text-stone-500 text-sm italic">No messages yet. Be the first to write!</p>
              </div>
            </div>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write a farewell message..."
              className="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-lg text-stone-100 placeholder-stone-500 focus:outline-none focus:border-gold-500 transition-colors resize-none"
              rows={3}
              style={{ fontFamily: 'var(--font-handwriting)', fontSize: '1.05rem' }}
            />
            <button
              onClick={() => setMessage('')}
              className="mt-3 w-full py-2.5 bg-gold-500 hover:bg-gold-600 text-stone-900 font-semibold rounded-md transition-colors cursor-pointer"
            >
              Send Message ✉️
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
