'use client'

import type { UploadedFile } from '@/types'
import { getStatusIcon } from './utils'
import { X } from 'lucide-react'

interface FilePreviewProps {
    file: UploadedFile
    removeFile: (id: string) => void
}

export function FilePreview({ file, removeFile }: FilePreviewProps) {
    return (
        <div key={file.id} className="group relative">
            <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                <img
                    src={file.preview || '/placeholder.svg'}
                    alt={file.file.name}
                    className="h-full w-full object-cover"
                />
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
                {getStatusIcon(file.status)}
                <button
                    type="button"
                    onClick={() => removeFile(file.id)}
                    className="rounded-full bg-red-500 p-1 text-white transition-colors hover:bg-red-600"
                >
                    <X className="h-3 w-3" />
                </button>
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
