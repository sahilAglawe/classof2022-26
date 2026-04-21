import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore'
import { auth, db } from './config'
import { sendRegistrationPendingEmail } from './email'

// ==========================================
// REGISTER — Creates user + saves to Firestore
// ==========================================
export async function registerUser({ name, email, branch, rollNo, password }) {
  // 1. Create Firebase Auth user
  const userCredential = await createUserWithEmailAndPassword(auth, email, password)
  const user = userCredential.user

  // 2. Save user profile in Firestore with "pending" status
  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    name,
    email,
    branch,
    rollNo,
    profilePic: '',
    status: 'pending', // pending | approved | rejected
    role: 'student',   // student | admin
    createdAt: serverTimestamp(),
  })

  // 3. Sign out immediately (user can't use app until approved)
  await signOut(auth)

  // 4. Send "pending approval" email notification
  await sendRegistrationPendingEmail({ name, email })

  return { success: true, message: 'Registration successful! A confirmation email has been sent. Awaiting admin approval.' }
}

// ==========================================
// SIGN IN — Checks approval status
// ==========================================
export async function signInUser(email, password) {
  // 1. Sign in with Firebase Auth
  const userCredential = await signInWithEmailAndPassword(auth, email, password)
  const user = userCredential.user

  // 2. Check user status in Firestore
  const userDoc = await getDoc(doc(db, 'users', user.uid))

  if (!userDoc.exists()) {
    await signOut(auth)
    throw new Error('User profile not found. Please register again.')
  }

  const userData = userDoc.data()

  // 3. Check if admin approved
  if (userData.status === 'pending') {
    await signOut(auth)
    throw new Error('Your account is pending admin approval. Please wait.')
  }

  if (userData.status === 'rejected') {
    await signOut(auth)
    throw new Error('Your access request was rejected. Contact the admin.')
  }

  // 4. User is approved — return profile data
  return {
    uid: user.uid,
    ...userData,
  }
}

// ==========================================
// SIGN OUT
// ==========================================
export async function signOutUser() {
  await signOut(auth)
}

// ==========================================
// GET CURRENT USER PROFILE
// ==========================================
export async function getCurrentUserProfile(uid) {
  const userDoc = await getDoc(doc(db, 'users', uid))
  if (!userDoc.exists()) return null
  return { uid, ...userDoc.data() }
}

// ==========================================
// AUTH STATE LISTENER
// ==========================================
export function onAuthChange(callback) {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      const profile = await getCurrentUserProfile(user.uid)
      callback(profile)
    } else {
      callback(null)
    }
  })
}
