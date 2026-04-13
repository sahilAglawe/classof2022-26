import { useState, useEffect } from 'react'
import { getAllUsers, approveUser, rejectUser } from '../firebase/firestore'

export default function AdminDashboard({ user, onBack }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('pending')
  const [actionLoading, setActionLoading] = useState(null)

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const allUsers = await getAllUsers()
      setUsers(allUsers)
    } catch (err) {
      console.error('Error fetching users:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleApprove = async (uid) => {
    setActionLoading(uid)
    try {
      await approveUser(uid)
      setUsers((prev) =>
        prev.map((u) => (u.uid === uid ? { ...u, status: 'approved' } : u))
      )
    } catch (err) {
      alert('Error approving user: ' + err.message)
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (uid) => {
    setActionLoading(uid)
    try {
      await rejectUser(uid)
      setUsers((prev) =>
        prev.map((u) => (u.uid === uid ? { ...u, status: 'rejected' } : u))
      )
    } catch (err) {
      alert('Error rejecting user: ' + err.message)
    } finally {
      setActionLoading(null)
    }
  }

  const pendingUsers = users.filter((u) => u.status === 'pending')
  const approvedUsers = users.filter((u) => u.status === 'approved')
  const rejectedUsers = users.filter((u) => u.status === 'rejected')

  const getInitials = (name) => {
    if (!name) return '?'
    return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
  }

  const getDisplayUsers = () => {
    if (activeTab === 'pending') return pendingUsers
    if (activeTab === 'approved') return approvedUsers
    if (activeTab === 'rejected') return rejectedUsers
    return users
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return '—'
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <section className="min-h-screen">
      {/* Header */}
      <div className="pt-10 pb-8" style={{ background: 'linear-gradient(180deg, #0c1220 0%, #111827 100%)' }}>
        <div className="px-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-stone-400 hover:text-gold-500 transition-colors cursor-pointer text-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back to Site
            </button>
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: '#2d2a24', color: 'var(--color-gold-500)' }}
              >
                {getInitials(user?.name)}
              </div>
              <span className="text-stone-300 text-sm">{user?.name}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/30">
                Admin
              </span>
            </div>
          </div>

          <h1
            className="text-4xl md:text-5xl text-stone-100 mb-3"
            style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400 }}
          >
            🛡️ Admin Dashboard
          </h1>
          <p className="text-stone-400 text-base">Manage user registrations, approve or reject access requests.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-8 -mt-1 pb-6" style={{ background: '#111827' }}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-xl p-4 border border-stone-700/50" style={{ background: '#1a1f2e' }}>
            <p className="text-stone-500 text-xs uppercase tracking-wider mb-1">Total Users</p>
            <p className="text-2xl font-bold text-stone-100">{users.length}</p>
          </div>
          <div className="rounded-xl p-4 border border-yellow-500/20" style={{ background: '#1a1f2e' }}>
            <p className="text-yellow-500 text-xs uppercase tracking-wider mb-1">⏳ Pending</p>
            <p className="text-2xl font-bold text-yellow-400">{pendingUsers.length}</p>
          </div>
          <div className="rounded-xl p-4 border border-green-500/20" style={{ background: '#1a1f2e' }}>
            <p className="text-green-500 text-xs uppercase tracking-wider mb-1">✅ Approved</p>
            <p className="text-2xl font-bold text-green-400">{approvedUsers.length}</p>
          </div>
          <div className="rounded-xl p-4 border border-red-500/20" style={{ background: '#1a1f2e' }}>
            <p className="text-red-500 text-xs uppercase tracking-wider mb-1">❌ Rejected</p>
            <p className="text-2xl font-bold text-red-400">{rejectedUsers.length}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-stone-950 py-8">
        <div className="px-8">
          {/* Tabs */}
          <div className="flex gap-2 mb-8 border-b border-stone-800 pb-4">
            {[
              { id: 'pending', label: 'Pending Requests', count: pendingUsers.length, color: 'yellow' },
              { id: 'approved', label: 'Approved', count: approvedUsers.length, color: 'green' },
              { id: 'rejected', label: 'Rejected', count: rejectedUsers.length, color: 'red' },
              { id: 'all', label: 'All Users', count: users.length, color: 'stone' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-stone-800 text-stone-100'
                    : 'text-stone-500 hover:text-stone-300 hover:bg-stone-900'
                }`}
              >
                {tab.label}
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full ${
                    activeTab === tab.id
                      ? `bg-${tab.color}-500/20 text-${tab.color}-400`
                      : 'bg-stone-800 text-stone-500'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Loading */}
          {loading && (
            <div className="text-center py-16">
              <p className="text-stone-500 text-lg">Loading users...</p>
            </div>
          )}

          {/* Users List */}
          {!loading && getDisplayUsers().length === 0 && (
            <div className="text-center py-16">
              <p className="text-stone-500 text-lg">
                {activeTab === 'pending' && 'No pending requests 🎉'}
                {activeTab === 'approved' && 'No approved users yet'}
                {activeTab === 'rejected' && 'No rejected users'}
                {activeTab === 'all' && 'No users registered yet'}
              </p>
            </div>
          )}

          {!loading && getDisplayUsers().length > 0 && (
            <div className="space-y-3">
              {getDisplayUsers().map((u) => (
                <div
                  key={u.uid}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl border border-stone-800 transition-all hover:border-stone-700"
                  style={{ background: '#12110e' }}
                >
                  {/* User Info */}
                  <div className="flex items-center gap-4">
                    {u.profilePic ? (
                      <img src={u.profilePic} alt={u.name} className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                        style={{ background: '#2d2a24', color: 'var(--color-gold-500)' }}
                      >
                        {getInitials(u.name)}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-stone-100 font-semibold text-sm">{u.name}</h3>
                        {u.role === 'admin' && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/30">
                            Admin
                          </span>
                        )}
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                            u.status === 'pending'
                              ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'
                              : u.status === 'approved'
                              ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                              : 'bg-red-500/10 text-red-400 border border-red-500/30'
                          }`}
                        >
                          {u.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500">
                        <span>{u.email}</span>
                        <span>•</span>
                        <span>{u.branch}</span>
                        {u.rollNo && (
                          <>
                            <span>•</span>
                            <span className="font-mono">{u.rollNo}</span>
                          </>
                        )}
                        <span>•</span>
                        <span>Joined {formatDate(u.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {u.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(u.uid)}
                          disabled={actionLoading === u.uid}
                          className="px-4 py-2 rounded-lg text-xs font-semibold tracking-wide bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500/20 transition-all cursor-pointer disabled:opacity-50"
                        >
                          {actionLoading === u.uid ? '...' : '✅ Approve'}
                        </button>
                        <button
                          onClick={() => handleReject(u.uid)}
                          disabled={actionLoading === u.uid}
                          className="px-4 py-2 rounded-lg text-xs font-semibold tracking-wide bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition-all cursor-pointer disabled:opacity-50"
                        >
                          {actionLoading === u.uid ? '...' : '❌ Reject'}
                        </button>
                      </>
                    )}
                    {u.status === 'approved' && u.uid !== user?.uid && (
                      <button
                        onClick={() => handleReject(u.uid)}
                        disabled={actionLoading === u.uid}
                        className="px-4 py-2 rounded-lg text-xs font-semibold tracking-wide bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition-all cursor-pointer disabled:opacity-50"
                      >
                        Revoke Access
                      </button>
                    )}
                    {u.status === 'rejected' && (
                      <button
                        onClick={() => handleApprove(u.uid)}
                        disabled={actionLoading === u.uid}
                        className="px-4 py-2 rounded-lg text-xs font-semibold tracking-wide bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500/20 transition-all cursor-pointer disabled:opacity-50"
                      >
                        Re-approve
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Refresh button */}
          <div className="text-center mt-8">
            <button
              onClick={fetchUsers}
              disabled={loading}
              className="px-6 py-2.5 border border-stone-600 text-stone-400 text-sm tracking-wide rounded-lg hover:border-gold-500 hover:text-gold-500 transition-all cursor-pointer disabled:opacity-50"
            >
              🔄 Refresh List
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
