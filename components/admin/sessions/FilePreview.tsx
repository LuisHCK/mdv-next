'use client'

import type { UploadedFile } from '@/types'
import { X } from 'lucide-react'
import { useEffect, useState } from 'react'
import {
    downscaleImageFromObjectURL,
    peekDownscaleCache,
    downscaleWithWorker,
    setDownscaleCache,
    enqueueDownscaleTask,
    generateTinyPreviewFromBlobURL,
    peekTinyPreviewCache
} from '@/lib/utils'

interface FilePreviewProps {
    file: UploadedFile
    removeFile: (id: string) => void
}

export function FilePreview({ file, removeFile }: FilePreviewProps) {
    // If it's a blob (local just selected), start without a full-sized preview so we can show the tiny blur first
    const [scaledPreview, setScaledPreview] = useState<string>(
        file.preview.startsWith('blob:') ? '' : file.preview
    )
    const [tinyPreview, setTinyPreview] = useState<string>('')
    const [isProcessing, setIsProcessing] = useState<boolean>(false)

    useEffect(() => {
        let cancelled = false
        const run = async () => {
            if (!file.preview) return
            if (!file.preview.startsWith('blob:')) return // external / already optimized source
            const fullCached = peekDownscaleCache(file.preview)
            if (fullCached) {
                setScaledPreview(fullCached)
                return
            }
            // Tiny preview phase (non-blocking for main queue)
            const tinyCached = peekTinyPreviewCache(file.preview)
            if (tinyCached) {
                setTinyPreview(tinyCached)
            } else {
                generateTinyPreviewFromBlobURL(file.preview, 24).then(tp => {
                    if (!cancelled) setTinyPreview(tp)
                })
            }
            setIsProcessing(true)
            // Try worker first (off-main-thread)
            const result = await enqueueDownscaleTask(async () => {
                let workerResult = ''
                try {
                    workerResult = await downscaleWithWorker({
                        blobUrl: file.preview,
                        file: file.file,
                        maxDimension: 800,
                        quality: 0.8,
                        mimeType: 'image/jpeg'
                    })
                } catch (e) {
                    console.warn('Worker downscale failed early, fallback to main thread.', e)
                }
                if (!workerResult) {
                    workerResult = await downscaleImageFromObjectURL(file.preview, {
                        maxDimension: 800,
                        quality: 0.8,
                        mimeType: 'image/jpeg',
                        revokeOriginal: true,
                        useCache: true
                    })
                } else {
                    try {
                        URL.revokeObjectURL(file.preview)
                    } catch {}
                    setDownscaleCache(file.preview, workerResult)
                }
                return workerResult
            })
            if (cancelled) return
            setScaledPreview(result)
            setTinyPreview('')
            setIsProcessing(false)
        }
        run()
        return () => {
            cancelled = true
        }
    }, [file.preview])

    return (
        <div key={file.id} className="group relative">
            <div className="aspect-square overflow-hidden rounded-lg bg-gray-100 relative">
                {tinyPreview && !scaledPreview && (
                    <img
                        src={tinyPreview}
                        alt="preview tiny"
                        aria-hidden="true"
                        className="h-full w-full object-cover blur-xl scale-105 animate-pulse"
                    />
                )}
                {scaledPreview && (
                    <img
                        src={scaledPreview}
                        alt={file.file.name}
                        className="h-full w-full object-cover fade-in opacity-0 data-[loaded='true']:opacity-100 transition-opacity duration-300"
                        onLoad={e => {
                            ;(e.currentTarget as HTMLImageElement).setAttribute('data-loaded', 'true')
                        }}
                    />
                )}
                {isProcessing && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/40 text-[10px] font-medium text-gray-600">
                        Procesando...
                    </div>
                )}
            </div>

            {/* File Info Overlay */}
            <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                <div className="p-2 text-center text-white">
                    <p
                        className="max-w-[150px] truncate text-sm font-medium"
                        title={file.file.name}
                    >
                        {file.file.name}
                    </p>
                    <p className="text-xs">{(file.file.size / 1024 / 1024).toFixed(1)} MB</p>
                </div>
            </div>

            {/* Status and Remove Button */}
            <div className="absolute right-2 top-2 flex gap-1">
                {file.status !== 'uploading' && (
                    <button
                        type="button"
                        onClick={() => removeFile(file.id)}
                        className="rounded-full bg-red-500 p-1 text-white transition-colors hover:bg-red-600"
                    >
                        <X className="h-3 w-3" />
                    </button>
                )}
            </div>

            {/* Progress Bar */}
            {file.status === 'uploading' && (
                <div className="absolute bottom-0 left-0 right-0 rounded-b-lg bg-black/50 p-2">
                    <div className="h-1 overflow-hidden rounded-full bg-gray-300">
                        <div
                            className="h-full bg-primary transition-all duration-300"
                            style={{
                                width: `${file.progress}%`
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}
