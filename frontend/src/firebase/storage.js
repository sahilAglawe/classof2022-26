import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage'
import { storage } from './config'

// ==========================================
// IMAGE COMPRESSION
// ==========================================
function compressImage(file, maxWidth = 1000, quality = 0.6) {
  return new Promise((resolve, reject) => {
    console.log('[Storage] Compressing image:', file.name, 'Size:', (file.size / 1024).toFixed(0) + 'KB')
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.onload = (e) => {
      const img = new Image()
      img.onerror = () => reject(new Error('Failed to load image'))
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height

        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (!blob) { reject(new Error('Compression failed')); return }
            console.log('[Storage] Compressed to:', (blob.size / 1024).toFixed(0) + 'KB')
            resolve(blob)
          },
          'image/jpeg',
          quality
        )
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  })
}

// ==========================================
// UPLOAD WITH PROGRESS
// ==========================================
function uploadWithProgress(storageRef, blob, onProgress) {
  return new Promise((resolve, reject) => {
    console.log('[Storage] Starting upload, blob size:', (blob.size / 1024).toFixed(0) + 'KB')
    const uploadTask = uploadBytesResumable(storageRef, blob)

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
        console.log('[Storage] Progress:', pct + '%')
        if (onProgress) onProgress(pct)
      },
      (error) => {
        console.error('[Storage] Upload ERROR:', error.code, error.message)
        reject(error)
      },
      async () => {
        console.log('[Storage] Upload complete, getting URL...')
        const url = await getDownloadURL(uploadTask.snapshot.ref)
        console.log('[Storage] Download URL:', url)
        resolve(url)
      }
    )
  })
}

// ==========================================
// PROFILE PICTURE
// ==========================================
export async function uploadProfilePic(uid, file, onProgress, onStatus) {
  try {
    if (onStatus) onStatus('compressing')
    const blob = await compressImage(file, 400, 0.7)
    if (onStatus) onStatus('uploading')
    const storageRef = ref(storage, `profilePics/${uid}`)
    return await uploadWithProgress(storageRef, blob, onProgress)
  } catch (err) {
    console.error('[Storage] uploadProfilePic failed:', err)
    throw err
  }
}

// ==========================================
// MEDIA VAULT IMAGE
// ==========================================
export async function uploadMediaImage(uid, file, onProgress, onStatus) {
  try {
    if (onStatus) onStatus('compressing')
    const blob = await compressImage(file, 1000, 0.6)
    if (onStatus) onStatus('uploading')
    const fileName = `${Date.now()}_${file.name}`
    const storageRef = ref(storage, `mediaVault/${uid}/${fileName}`)
    return await uploadWithProgress(storageRef, blob, onProgress)
  } catch (err) {
    console.error('[Storage] uploadMediaImage failed:', err)
    throw err
  }
}

// ==========================================
// DELETE IMAGE
// ==========================================
export async function deleteImage(path) {
  const storageRef = ref(storage, path)
  await deleteObject(storageRef)
}
