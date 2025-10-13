import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merges multiple class values into a single string, handling conditional and deduplicated class names.
 *
 * Utilizes `clsx` to conditionally join class names and `twMerge` to intelligently merge Tailwind CSS classes,
 * ensuring that conflicting classes are resolved according to Tailwind's rules.
 *
 * @param inputs - An array of class values (strings, arrays, objects, etc.) to be merged.
 * @returns A single string of merged class names.
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const getColorClasses = (color: string, variant: 'bg' | 'text' | 'border' | 'hover') => {
    const colorMap = {
        rose: {
            bg: 'bg-brand-primary',
            text: 'text-brand-primary',
            border: 'border-brand-primary',
            hover: 'hover:bg-brand-primary/90'
        },
        amber: {
            bg: 'bg-brand-primary',
            text: 'text-brand-primary',
            border: 'border-brand-primary',
            hover: 'hover:bg-brand-primary/90'
        },
        emerald: {
            bg: 'bg-brand-primary',
            text: 'text-brand-primary',
            border: 'border-brand-primary',
            hover: 'hover:bg-brand-primary/90'
        },
        purple: {
            bg: 'bg-brand-primary',
            text: 'text-brand-primary',
            border: 'border-brand-primary',
            hover: 'hover:bg-brand-primary/90'
        }
    }
    return colorMap[color as keyof typeof colorMap]?.[variant] || colorMap.rose[variant]
}


/**
 * Generates a URL for accessing an asset file stored in a PocketBase collection.
 *
 * @param collectionId - The ID of the PocketBase collection containing the asset.
 * @param recordId - The ID of the record within the collection.
 * @param filename - The name of the asset file.
 * @returns The full URL to the asset file, or a placeholder image path if the filename is not provided.
 */
export const getPocketBaseAssetUrl = (collectionId: string, recordId: string, filename: string): string => {
    if (!filename) return '/placeholder.svg'
    return `${process.env.API_URL}/api/files/${collectionId}/${recordId}/${filename}`
}

// --- Image Utilities ---
export interface DownscaleOptions {
    maxDimension?: number // Max width or height in pixels
    quality?: number // 0 - 1 quality for lossy formats
    mimeType?: string // e.g. 'image/jpeg', 'image/webp'
    revokeOriginal?: boolean // revoke the provided blob URL after processing
    useCache?: boolean // enable/disable in-memory cache
}

/**
 * Downscale an image referenced by a blob/object URL to a data URL for lightweight previews.
 * Safe to call only in the browser (uses DOM APIs). Avoid calling during SSR.
 *
 * @param url Blob/object URL pointing to the original file (e.g. from URL.createObjectURL)
 * @param options Optional tuning for size, quality and mime type
 * @returns Promise resolving to a data URL (or the original url if downscale fails)
 */
// Simple in-memory cache mapping original blob URLs to downscaled data URLs
const downscaleCache = new Map<string, string>()
// Separate cache for tiny (blur) previews so it doesn't conflict with full-size cache
const tinyPreviewCache = new Map<string, string>()

export function peekDownscaleCache(url: string): string | undefined {
    return downscaleCache.get(url)
}

export function setDownscaleCache(url: string, dataUrl: string) {
    downscaleCache.set(url, dataUrl)
}

export function peekTinyPreviewCache(url: string): string | undefined {
    return tinyPreviewCache.get(url)
}

export function setTinyPreviewCache(url: string, dataUrl: string) {
    tinyPreviewCache.set(url, dataUrl)
}

export async function generateTinyPreviewFromBlobURL(
    url: string,
    maxDimension = 32
): Promise<string> {
    if (typeof window === 'undefined') return url
    if (!url.startsWith('blob:')) return url
    const cached = tinyPreviewCache.get(url)
    if (cached) return cached
    return new Promise(resolve => {
        try {
            const img = new Image()
            img.onload = () => {
                try {
                    let { width, height } = img
                    if (Math.max(width, height) > maxDimension) {
                        if (width > height) {
                            height = Math.round((height / width) * maxDimension)
                            width = maxDimension
                        } else {
                            width = Math.round((width / height) * maxDimension)
                            height = maxDimension
                        }
                    }
                    const canvas = document.createElement('canvas')
                    canvas.width = width
                    canvas.height = height
                    const ctx = canvas.getContext('2d')
                    if (!ctx) {
                        resolve(url)
                        return
                    }
                    ctx.drawImage(img, 0, 0, width, height)
                    let dataUrl = url
                    try {
                        dataUrl = canvas.toDataURL('image/jpeg', 0.5)
                    } catch {}
                    tinyPreviewCache.set(url, dataUrl)
                    resolve(dataUrl)
                } catch (e) {
                    console.error('Tiny preview generation error', e)
                    resolve(url)
                }
            }
            img.onerror = () => resolve(url)
            img.src = url
        } catch (e) {
            console.error('Tiny preview unexpected error', e)
            resolve(url)
        }
    })
}

// Lazy singleton worker instance
let imageWorker: Worker | null = null

interface WorkerDownscaleParams {
    blobUrl: string
    file: File
    maxDimension?: number
    quality?: number
    mimeType?: string
}

export function ensureImageWorker(): Worker | null {
    if (typeof window === 'undefined') return null
    if (imageWorker) return imageWorker
    try {
        // Using dynamic import-like construction to allow Next.js bundling (will treat as module worker if supported)
        imageWorker = new Worker(new URL('./workers/image-downscale.worker.ts', import.meta.url), {
            type: 'module'
        })
        imageWorker.addEventListener('error', e => {
            console.error('Image worker error', e)
        })
        imageWorker.addEventListener('messageerror', e => {
            console.error('Image worker message error', e)
        })
    } catch (e) {
        console.warn('Failed to initialize image worker, will fallback to main thread.', e)
        imageWorker = null
    }
    return imageWorker
}

export function downscaleWithWorker(
    params: WorkerDownscaleParams
): Promise<string> {
    return new Promise(resolve => {
        const worker = ensureImageWorker()
        if (!worker) {
            resolve('')
            return
        }
        const id = crypto.randomUUID()
        const handler = (e: MessageEvent<any>) => {
            if (e.data?.id !== id) return
            worker.removeEventListener('message', handler)
            const { dataUrl, error } = e.data
            if (error) {
                console.warn('Worker downscale fallback due to error:', error)
                resolve('')
            } else if (dataUrl) {
                resolve(dataUrl)
            } else {
                resolve('')
            }
        }
        worker.addEventListener('message', handler)
        worker.postMessage({
            id,
            file: params.file,
            options: {
                maxDimension: params.maxDimension,
                quality: params.quality,
                mimeType: params.mimeType
            }
        })
    })
}

export async function downscaleImageFromObjectURL(
    url: string,
    options: DownscaleOptions = {}
): Promise<string> {
    const {
        maxDimension = 800,
        quality = 0.8,
        mimeType = 'image/jpeg',
        revokeOriginal = true,
        useCache = true
    } = options

    if (typeof window === 'undefined') return url // SSR safeguard
    if (!url.startsWith('blob:')) return url // Already processed or not a blob

    if (useCache) {
        const cached = downscaleCache.get(url)
        if (cached) return cached
    }

    return new Promise(resolve => {
        try {
            const img = new Image()
            img.onload = () => {
                try {
                    let { width, height } = img
                    if (Math.max(width, height) > maxDimension) {
                        if (width > height) {
                            height = Math.round((height / width) * maxDimension)
                            width = maxDimension
                        } else {
                            width = Math.round((width / height) * maxDimension)
                            height = maxDimension
                        }
                    }
                    const canvas = document.createElement('canvas')
                    canvas.width = width
                    canvas.height = height
                    const ctx = canvas.getContext('2d')
                    if (!ctx) {
                        if (revokeOriginal) URL.revokeObjectURL(url)
                        resolve(url)
                        return
                    }
                    ctx.drawImage(img, 0, 0, width, height)
                    let dataUrl = url
                    try {
                        dataUrl = canvas.toDataURL(mimeType, quality)
                    } catch {
                        try {
                            dataUrl = canvas.toDataURL('image/jpeg', quality)
                        } catch {}
                    }
                    if (useCache) downscaleCache.set(url, dataUrl)
                    if (revokeOriginal) URL.revokeObjectURL(url)
                    resolve(dataUrl)
                } catch (e) {
                    console.error('Downscale processing error', e)
                    if (revokeOriginal) URL.revokeObjectURL(url)
                    resolve(url)
                }
            }
            img.onerror = err => {
                console.error('Downscale image load error', err)
                if (revokeOriginal) URL.revokeObjectURL(url)
                resolve(url)
            }
            img.src = url
        } catch (e) {
            console.error('Downscale unexpected error', e)
            try {
                if (revokeOriginal && url.startsWith('blob:')) URL.revokeObjectURL(url)
            } catch {}
            resolve(url)
        }
    })
}

// --- Concurrency Queue for Downscaling (parallel limit) ---
interface DownscaleQueueJob {
    start: () => Promise<string>
    resolve: (v: string) => void
    reject: (e: any) => void
}

let _downscaleMaxConcurrency = 3
let _downscaleActive = 0
const _downscaleQueue: DownscaleQueueJob[] = []

function _runNextDownscale() {
    if (_downscaleActive >= _downscaleMaxConcurrency) return
    const job = _downscaleQueue.shift()
    if (!job) return
    _downscaleActive++
    job
        .start()
        .then(r => job.resolve(r))
        .catch(err => job.reject(err))
        .finally(() => {
            _downscaleActive--
            _runNextDownscale()
        })
}

export function setDownscaleConcurrency(n: number) {
    _downscaleMaxConcurrency = Math.max(1, n)
    _runNextDownscale()
}

export function enqueueDownscaleTask(task: () => Promise<string>): Promise<string> {
    return new Promise((resolve, reject) => {
        _downscaleQueue.push({ start: task, resolve, reject })
        _runNextDownscale()
    })
}