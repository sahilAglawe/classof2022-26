import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage'
import { storage } from './config'

// ==========================================
// PROFILE PICTURE UPLOAD
// ==========================================
export async function uploadProfilePic(uid, file) {
  const storageRef = ref(storage, `profilePics/${uid}`)
  const snapshot = await uploadBytes(storageRef, file)
  const downloadURL = await getDownloadURL(snapshot.ref)
  return downloadURL
}

// ==========================================
// MEDIA VAULT IMAGE UPLOAD
// ==========================================
export async function uploadMediaImage(uid, file) {
  const fileName = `${Date.now()}_${file.name}`
  const storageRef = ref(storage, `mediaVault/${uid}/${fileName}`)
  const snapshot = await uploadBytes(storageRef, file)
  const downloadURL = await getDownloadURL(snapshot.ref)
  return downloadURL
}

// ==========================================
// DELETE IMAGE
// ==========================================
export async function deleteImage(path) {
  const storageRef = ref(storage, path)
  await deleteObject(storageRef)
}
