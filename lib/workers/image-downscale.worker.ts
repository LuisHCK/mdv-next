/*
 * Web Worker: Downscale high-resolution images off the main thread
 */

interface WorkerRequestOptions {
  maxDimension?: number
  quality?: number
  mimeType?: string
}

interface WorkerRequest {
  id: string
  file: File
  options: WorkerRequestOptions
}

interface WorkerResponse {
  id: string
  dataUrl?: string
  error?: string
}

// Utility to convert a Blob to base64 data URL
const blobToDataURL = async (blob: Blob, mimeType: string): Promise<string> => {
  const buffer = await blob.arrayBuffer()
  let binary = ''
  const bytes = new Uint8Array(buffer)
  const len = bytes.byteLength
  for (let i = 0; i < len; i++) binary += String.fromCharCode(bytes[i])
  const base64 = btoa(binary)
  return `data:${mimeType};base64,${base64}`
}

self.addEventListener('message', async (event: MessageEvent<WorkerRequest>) => {
  const { id, file, options } = event.data
  const {
    maxDimension = 800,
    quality = 0.8,
    mimeType = 'image/jpeg'
  } = options || {}

  const respond = (resp: WorkerResponse) => {
    ;(self as unknown as Worker).postMessage(resp)
  }

  try {
    if (!(file instanceof Blob)) {
      respond({ id, error: 'Invalid file provided' })
      return
    }

    if (typeof OffscreenCanvas === 'undefined' || typeof createImageBitmap === 'undefined') {
      respond({ id, error: 'OffscreenCanvas or createImageBitmap unsupported' })
      return
    }

    const bitmap = await createImageBitmap(file)
    let width = bitmap.width
    let height = bitmap.height

    if (Math.max(width, height) > maxDimension) {
      if (width > height) {
        height = Math.round((height / width) * maxDimension)
        width = maxDimension
      } else {
        width = Math.round((width / height) * maxDimension)
        height = maxDimension
      }
    }

    const canvas = new OffscreenCanvas(width, height)
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      respond({ id, error: 'Failed to get 2d context' })
      return
    }

    ctx.drawImage(bitmap, 0, 0, width, height)

    let blob: Blob
    try {
      blob = await canvas.convertToBlob({ type: mimeType, quality })
    } catch (e) {
      blob = await canvas.convertToBlob({ type: 'image/jpeg', quality })
    }

    const dataUrl = await blobToDataURL(blob, blob.type || mimeType)
    respond({ id, dataUrl })
  } catch (error: any) {
    respond({ id, error: error?.message || 'Unknown worker error' })
  }
})
