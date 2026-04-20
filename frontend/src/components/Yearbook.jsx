import { useState, useEffect, useRef } from 'react'
import { getApprovedUsers, updateUserProfile, getYearbookMessages, addYearbookMessage } from '../firebase/firestore'
import { uploadProfilePic } from '../firebase/storage'

const majors = ['All Majors', 'CSE']

export default function Yearbook({ user }) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All Majors')
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [message, setMessage] = useState('')
  const [visibleCount, setVisibleCount] = useState(8)
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [studentMessages, setStudentMessages] = useState([])
  const [messagesLoading, setMessagesLoading] = useState(false)
  const [sendingMsg, setSendingMsg] = useState(false)
  const [uploadingPic, setUploadingPic] = useState(false)
  const fileInputRef = useRef(null)

  // Fetch approved students from Firestore
  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true)
      try {
        const approved = await getApprovedUsers()
        setStudents(approved)
      } catch (err) {
        console.error('Error fetching students:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchStudents()
  }, [])

  // Fetch messages when a student is selected
  useEffect(() => {
    if (!selectedStudent) return
    const fetchMessages = async () => {
      setMessagesLoading(true)
      try {
        const msgs = await getYearbookMessages(selectedStudent.uid)
        setStudentMessages(msgs)
      } catch (err) {
        console.error('Error fetching messages:', err)
        setStudentMessages([])
      } finally {
        setMessagesLoading(false)
      }
    }
    fetchMessages()
  }, [selectedStudent])

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedStudent) return
    setSendingMsg(true)
    try {
      await addYearbookMessage({
        toUid: selectedStudent.uid,
        text: message.trim(),
        authorName: user ? user.name : 'Anonymous',
        authorUid: user ? user.uid : 'anonymous',
      })
      // Refresh messages
      const msgs = await getYearbookMessages(selectedStudent.uid)
      setStudentMessages(msgs)
      setMessage('')
    } catch (err) {
      alert('Error sending message: ' + err.message)
    } finally {
      setSendingMsg(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleProfilePicUpload = async (e) => {
    const file = e.target.files[0]
    if (!file || !user) return

    setUploadingPic(true)
    try {
      const downloadURL = await uploadProfilePic(user.uid, file)
      await updateUserProfile(user.uid, { profilePic: downloadURL })
      // Update local students list
      setStudents((prev) =>
        prev.map((s) => (s.uid === user.uid ? { ...s, profilePic: downloadURL } : s))
      )
      // Update selected student if it's the current user
      if (selectedStudent?.uid === user.uid) {
        setSelectedStudent((prev) => ({ ...prev, profilePic: downloadURL }))
      }
    } catch (err) {
      alert('Error uploading profile pic: ' + err.message)
    } finally {
      setUploadingPic(false)
    }
  }

  const getInitials = (name) => {
    if (!name) return '?'
    return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
  }

  const filtered = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.rollNo && s.rollNo.toLowerCase().includes(search.toLowerCase()))
    const matchesMajor = filter === 'All Majors' || filter === s.branch
    return matchesSearch && matchesMajor
  })

  const formatDate = (timestamp) => {
    if (!timestamp) return ''
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleDateString()
  }

  return (
    <section className="min-h-screen">
      {/* Header */}
      <div className="bg-stone-950 pt-8 sm:pt-10 pb-10 sm:pb-14">
        <div className="px-4 sm:px-8 text-center">
          <h2
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-stone-100 mb-4 sm:mb-5"
            style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400 }}
          >
            The Class of '26
          </h2>
          <p className="text-stone-400 text-sm sm:text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Faces that defined our journey. Moments that became memories.
            Click a card to sign their yearbook.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="bg-stone-950 py-6 sm:py-10">
        <div className="px-4 sm:px-8">
          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-3 sm:gap-4 mb-8 sm:mb-10">
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
                className="w-full pl-12 pr-4 py-3 bg-stone-900 border border-stone-700 rounded-lg text-stone-100 placeholder-stone-500 focus:outline-none focus:border-gold-500 transition-colors text-sm sm:text-base"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {majors.map((m) => (
                <button
                  key={m}
                  onClick={() => setFilter(m)}
                  className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 cursor-pointer ${
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
          <div className="border-t border-stone-700 mb-6 sm:mb-10"></div>

          {/* Loading */}
          {loading && (
            <div className="text-center py-16">
              <p className="text-stone-500 text-lg">Loading classmates...</p>
            </div>
          )}

          {/* Student Grid */}
          {!loading && (
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {filtered.slice(0, visibleCount).map((student) => (
                <div
                  key={student.uid}
                  onClick={() => setSelectedStudent(student)}
                  className="student-card group bg-stone-900 border border-stone-800 rounded-lg overflow-hidden cursor-pointer hover:border-gold-500/30 hover:bg-stone-850 transition-all duration-300 hover:shadow-lg hover:shadow-gold-500/5"
                >
                  <div className="relative aspect-square overflow-hidden bg-stone-800">
                    {student.profilePic ? (
                      <img
                        src={student.profilePic}
                        alt={student.name}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-stone-700 to-stone-800">
                        <span
                          className="text-5xl md:text-6xl font-bold text-stone-500"
                          style={{ fontFamily: 'var(--font-serif)' }}
                        >
                          {getInitials(student.name)}
                        </span>
                      </div>
                    )}
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="px-4 py-2 bg-gold-500 text-stone-900 text-xs font-semibold tracking-[0.15em] uppercase rounded-sm">
                        Open Yearbook
                      </span>
                    </div>
                    {/* Profile pic update badge for own card */}
                    {user && student.uid === user.uid && (
                      <div className="absolute top-2 right-2 px-2 py-1 bg-gold-500/90 text-stone-900 text-[10px] font-bold rounded-sm uppercase tracking-wider">
                        You
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3
                      className="text-stone-100 font-semibold text-sm mb-1 group-hover:text-gold-500 transition-colors"
                      style={{ fontFamily: 'var(--font-serif)' }}
                    >
                      {student.name}
                    </h3>
                    <p className="text-stone-500 text-xs">{student.branch}</p>
                    {student.rollNo && (
                      <p className="text-stone-600 text-xs mt-1 font-mono">{student.rollNo}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Load More */}
          {!loading && visibleCount < filtered.length && (
            <div className="text-center mt-12">
              <button
                onClick={() => setVisibleCount((prev) => prev + 8)}
                className="px-8 py-3 border border-stone-600 text-stone-400 text-sm tracking-[0.2em] uppercase font-medium rounded-sm hover:border-gold-500 hover:text-gold-500 transition-all duration-300 cursor-pointer"
              >
                Load More Classmates
              </button>
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-stone-500 text-lg">No classmates found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Student Detail Modal */}
      {selectedStudent && (() => {
        const currentIndex = filtered.indexOf(selectedStudent)
        const prevStudent = currentIndex > 0 ? filtered[currentIndex - 1] : null
        const nextStudent = currentIndex < filtered.length - 1 ? filtered[currentIndex + 1] : null
        const isOwnCard = user && selectedStudent.uid === user.uid

        return (
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 backdrop-blur-md animate-fade-in"
            onClick={() => setSelectedStudent(null)}
          >
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

            <div
              className="flex flex-col md:flex-row w-full max-w-4xl max-h-[90vh] sm:max-h-[85vh] mx-3 sm:mx-4 rounded-xl overflow-hidden shadow-2xl border border-stone-800"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Left — Photo */}
              <div className="relative w-full md:w-1/2 bg-stone-900 flex-shrink-0 min-h-0">
                {selectedStudent.profilePic ? (
                  <img
                    src={selectedStudent.profilePic}
                    alt={selectedStudent.name}
                    className="w-full h-48 sm:h-64 md:h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-48 sm:h-64 md:h-full flex items-center justify-center bg-gradient-to-br from-stone-700 to-stone-800">
                    <span className="text-7xl md:text-9xl font-bold text-stone-500" style={{ fontFamily: 'var(--font-serif)' }}>
                      {getInitials(selectedStudent.name)}
                    </span>
                  </div>
                )}

                {/* Upload profile pic button — only on own card */}
                {isOwnCard && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingPic}
                    className="absolute top-4 right-4 px-3 py-2 bg-black/70 backdrop-blur-sm text-stone-200 text-xs rounded-lg hover:bg-gold-500 hover:text-stone-900 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                  >
                    📷 {uploadingPic ? 'Uploading...' : 'Update Photo'}
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePicUpload}
                  className="hidden"
                />

                {/* Name overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                  <h3
                    className="text-xl sm:text-2xl md:text-3xl font-bold text-stone-100 mb-1"
                    style={{ fontFamily: 'var(--font-serif)' }}
                  >
                    {selectedStudent.name}
                  </h3>
                  <p className="text-sm">
                    <span className="text-gold-500 font-semibold tracking-wide">{selectedStudent.branch}</span>
                    {selectedStudent.rollNo && (
                      <>
                        <span className="text-stone-400 mx-2">|</span>
                        <span className="text-stone-400 font-mono text-xs">{selectedStudent.rollNo}</span>
                      </>
                    )}
                  </p>
                </div>
              </div>

              {/* Right — Messages panel */}
              <div className="w-full md:w-1/2 bg-stone-950 flex flex-col min-h-0 flex-1">
                {/* Header */}
                <div className="flex items-center justify-between p-4 sm:p-5 border-b border-stone-800">
                  <div>
                    <p className="text-stone-500 text-xs mb-1" style={{ fontFamily: 'var(--font-handwriting)' }}>///</p>
                    <h4 className="text-stone-200 text-sm font-semibold tracking-wide">
                      Messages from the Batch
                    </h4>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 border border-stone-700 text-stone-500 text-xs tracking-wider uppercase rounded-sm">
                      {studentMessages.length} {studentMessages.length === 1 ? 'Reply' : 'Replies'}
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
                <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 sm:space-y-4 no-scrollbar">
                  {messagesLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-stone-500 italic">Loading messages...</p>
                    </div>
                  ) : studentMessages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center py-12">
                      <p className="text-stone-500 italic text-lg leading-relaxed" style={{ fontFamily: 'var(--font-handwriting)' }}>
                        No signatures yet.
                      </p>
                      <p className="text-stone-600 italic text-base mt-1" style={{ fontFamily: 'var(--font-handwriting)' }}>
                        Be the first to leave a memory.
                      </p>
                    </div>
                  ) : (
                    studentMessages.map((msg) => (
                      <div key={msg.id} className="bg-stone-900/80 border border-stone-800 rounded-lg p-4">
                        <p
                          className="text-stone-200 mb-2 leading-relaxed"
                          style={{ fontFamily: 'var(--font-handwriting)', fontSize: '1.1rem' }}
                        >
                          {msg.text}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-stone-500 text-xs">— {msg.authorName}</span>
                          <span className="text-stone-600 text-xs">{formatDate(msg.createdAt)}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Message input */}
                <div className="p-4 sm:p-5 border-t border-stone-800">
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
                      disabled={sendingMsg}
                      className="absolute bottom-3 right-3 w-8 h-8 flex items-center justify-center text-gold-500 hover:text-gold-400 transition-colors cursor-pointer disabled:opacity-50"
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
