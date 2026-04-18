// ==========================================
// CLOUDINARY IMAGE STORAGE
// Replaces Firebase Storage with Cloudinary
// Uses unsigned uploads (no backend needed)
// ==========================================

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`

// ==========================================
// IMAGE COMPRESSION (kept client-side)
// ==========================================
function compressImage(file, maxWidth = 1000, quality = 0.6) {
  return new Promise((resolve, reject) => {
    console.log('[Cloudinary] Compressing image:', file.name, 'Size:', (file.size / 1024).toFixed(0) + 'KB')
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
            console.log('[Cloudinary] Compressed to:', (blob.size / 1024).toFixed(0) + 'KB')
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
// UPLOAD TO CLOUDINARY WITH PROGRESS
// ==========================================
function uploadToCloudinary(blob, folder, onProgress) {
  return new Promise((resolve, reject) => {
    console.log('[Cloudinary] Starting upload, blob size:', (blob.size / 1024).toFixed(0) + 'KB')

    const formData = new FormData()
    formData.append('file', blob)
    formData.append('upload_preset', UPLOAD_PRESET)
    formData.append('folder', folder)

    const xhr = new XMLHttpRequest()

    // Track upload progress
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        const pct = Math.round((e.loaded / e.total) * 100)
        console.log('[Cloudinary] Progress:', pct + '%')
        if (onProgress) onProgress(pct)
      }
    })

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const response = JSON.parse(xhr.responseText)
        console.log('[Cloudinary] Upload complete, URL:', response.secure_url)
        resolve(response.secure_url)
      } else {
        console.error('[Cloudinary] Upload ERROR:', xhr.status, xhr.responseText)
        reject(new Error(`Upload failed with status ${xhr.status}: ${xhr.responseText}`))
      }
    })

    xhr.addEventListener('error', () => {
      console.error('[Cloudinary] Network error')
      reject(new Error('Network error during upload'))
    })

    xhr.addEventListener('abort', () => {
      reject(new Error('Upload aborted'))
    })

    xhr.open('POST', UPLOAD_URL)
    xhr.send(formData)
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
    return await uploadToCloudinary(blob, `classof2026/profilePics/${uid}`, onProgress)
  } catch (err) {
    console.error('[Cloudinary] uploadProfilePic failed:', err)
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
    return await uploadToCloudinary(blob, `classof2026/mediaVault/${uid}`, onProgress)
  } catch (err) {
    console.error('[Cloudinary] uploadMediaImage failed:', err)
    throw err
  }
}

// ==========================================
// DELETE IMAGE
// Note: Cloudinary deletion requires a signed request (backend).
// For now, we only remove the Firestore record.
// The image stays on Cloudinary (can be cleaned up later via dashboard).
// ==========================================
export async function deleteImage(path) {
  console.log('[Cloudinary] Delete requested for:', path)
  console.log('[Cloudinary] Note: Image removed from DB. Cloudinary cleanup can be done via dashboard.')
  // No-op for unsigned uploads — deletion requires backend signing
}
