import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from './config'

// ==========================================
// USERS — Admin functions
// ==========================================

// Get all users (for admin dashboard)
export async function getAllUsers() {
  const snapshot = await getDocs(collection(db, 'users'))
  return snapshot.docs.map((doc) => ({ uid: doc.id, ...doc.data() }))
}

// Get pending users (for admin approval)
export async function getPendingUsers() {
  const q = query(collection(db, 'users'), where('status', '==', 'pending'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ uid: doc.id, ...doc.data() }))
}

// Get approved users (for yearbook)
export async function getApprovedUsers() {
  const q = query(collection(db, 'users'), where('status', '==', 'approved'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ uid: doc.id, ...doc.data() }))
}

// Approve a user
export async function approveUser(uid) {
  await updateDoc(doc(db, 'users', uid), { status: 'approved' })
}

// Reject a user
export async function rejectUser(uid) {
  await updateDoc(doc(db, 'users', uid), { status: 'rejected' })
}

// Update user profile (profile pic, etc.)
export async function updateUserProfile(uid, data) {
  await updateDoc(doc(db, 'users', uid), data)
}

// ==========================================
// WALL MESSAGES
// ==========================================

// Get all wall messages
export async function getWallMessages() {
  const q = query(collection(db, 'wallMessages'), orderBy('createdAt', 'desc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}

// Add a wall message
export async function addWallMessage({ text, author, color }) {
  return await addDoc(collection(db, 'wallMessages'), {
    text,
    author,
    color,
    createdAt: serverTimestamp(),
  })
}

// Delete a wall message (by owner or admin)
export async function deleteWallMessage(messageId) {
  await deleteDoc(doc(db, 'wallMessages', messageId))
}

// ==========================================
// YEARBOOK MESSAGES (per student)
// ==========================================

// Get messages for a specific student
export async function getYearbookMessages(studentUid) {
  const q = query(
    collection(db, 'yearbookMessages'),
    where('toUid', '==', studentUid),
    orderBy('createdAt', 'desc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}

// Add a yearbook message to a student
export async function addYearbookMessage({ toUid, text, authorName, authorUid }) {
  return await addDoc(collection(db, 'yearbookMessages'), {
    toUid,
    text,
    authorName,
    authorUid,
    createdAt: serverTimestamp(),
  })
}

// ==========================================
// MEDIA VAULT
// ==========================================

// Get all media items
export async function getMediaItems() {
  const q = query(collection(db, 'mediaVault'), orderBy('createdAt', 'desc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}

// Add a media item
export async function addMediaItem({ imageUrl, caption, tag, monthYear, uploadedBy, uploadedByUid }) {
  return await addDoc(collection(db, 'mediaVault'), {
    imageUrl,
    caption,
    tag,
    monthYear: monthYear || '',
    uploadedBy,
    uploadedByUid,
    createdAt: serverTimestamp(),
  })
}

// Delete a media item (by owner or admin)
export async function deleteMediaItem(mediaId) {
  await deleteDoc(doc(db, 'mediaVault', mediaId))
}

// Update a media item
export async function updateMediaItem(mediaId, data) {
  await updateDoc(doc(db, 'mediaVault', mediaId), data)
}

// ==========================================
// USER-SPECIFIC QUERIES (for My Content panel)
// ==========================================

// Get media uploaded by a specific user
export async function getMyMediaItems(uid) {
  const q = query(
    collection(db, 'mediaVault'),
    where('uploadedByUid', '==', uid)
  )
  const snapshot = await getDocs(q)
  const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  // Sort client-side (newest first) to avoid needing a Firestore composite index
  return items.sort((a, b) => {
    const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0)
    const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0)
    return dateB - dateA
  })
}

// Get yearbook messages sent by a specific user
export async function getMyYearbookMessages(uid) {
  const q = query(
    collection(db, 'yearbookMessages'),
    where('authorUid', '==', uid)
  )
  const snapshot = await getDocs(q)
  const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  // Sort client-side (newest first)
  return items.sort((a, b) => {
    const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0)
    const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0)
    return dateB - dateA
  })
}

// Delete a yearbook message
export async function deleteYearbookMessage(messageId) {
  await deleteDoc(doc(db, 'yearbookMessages', messageId))
}
