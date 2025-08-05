'use client'

import { useState, useEffect } from 'react'
import { X, ChevronLeft, ChevronRight, Download, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

interface Photo {
    id: string
    filename: string
    src: string
    thumbnail: string
    alt: string
    caption: string
    tags: string[]
}

interface PhotoLightboxProps {
    photos: string[]
    currentIndex: number
    isOpen: boolean
    onClose: () => void
    onNext: () => void
    onPrevious: () => void
    setCurrentIndex: (index: number) => void
}

export function PhotoLightbox({
    photos,
    currentIndex,
    isOpen,
    onClose,
    onNext,
    onPrevious,
    setCurrentIndex
}: PhotoLightboxProps) {
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (!isOpen) return

            switch (event.key) {
                case 'Escape':
                    onClose()
                    break
                case 'ArrowLeft':
                    onPrevious()
                    break
                case 'ArrowRight':
                    onNext()
                    break
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [isOpen, onClose, onNext, onPrevious])

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }

        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    if (!isOpen || !photos[currentIndex]) return null

    const currentPhoto = photos[currentIndex]

    return (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm">
            {/* Header */}
            <div className="absolute left-0 right-0 top-0 z-10 bg-gradient-to-b from-black/50 to-transparent p-4">
                <div className="flex flex-col items-center justify-between text-white md:flex-row">
                    <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium">
                            {currentIndex + 1} de {photos.length}
                        </span>
                        <span className="text-sm text-white/70">{currentPhoto}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                            <Download className="h-5 w-5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                            className="text-white hover:bg-white/20"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Navigation Buttons */}
            <Button
                variant="ghost"
                size="lg"
                onClick={onPrevious}
                disabled={currentIndex === 0}
                className="absolute left-4 top-1/2 z-10 -translate-y-1/2 text-white hover:bg-white/20 disabled:opacity-30"
            >
                <ChevronLeft className="h-8 w-8" />
            </Button>

            <Button
                variant="ghost"
                size="lg"
                onClick={onNext}
                disabled={currentIndex === photos.length - 1}
                className="absolute right-4 top-1/2 z-10 -translate-y-1/2 text-white hover:bg-white/20 disabled:opacity-30"
            >
                <ChevronRight className="h-8 w-8" />
            </Button>

            {/* Main Image */}
            <div className="flex h-full items-center justify-center p-8 pb-24 pt-20">
                <div className="relative max-h-full max-w-7xl">
                    <Image
                        src={currentPhoto || '/placeholder.svg'}
                        alt={currentPhoto}
                        width={1200}
                        height={800}
                        className="max-h-full max-w-full object-contain"
                        onLoad={() => setIsLoading(false)}
                        priority
                    />
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <div className="h-8 w-8 animate-spin border-b-2 border-white"></div>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/50 to-transparent p-4">
                <div className="text-center text-white">
                    <h3 className="mb-1 text-lg font-semibold">{currentPhoto}</h3>
                </div>
            </div>

            {/* Thumbnail Strip */}
            <div className="absolute bottom-20 left-0 right-0 z-10">
                <div className="flex justify-center space-x-2 overflow-x-auto px-4">
                    {photos
                        .slice(Math.max(0, currentIndex - 5), currentIndex + 6)
                        .map((photo, index) => {
                            const actualIndex = Math.max(0, currentIndex - 5) + index
                            return (
                                <button
                                    key={`thumbnail-${actualIndex}`}
                                    onClick={() => {
                                        setCurrentIndex(actualIndex)
                                    }}
                                    className={`h-12 w-16 flex-shrink-0 overflow-hidden border-2 transition-all ${
                                        actualIndex === currentIndex
                                            ? 'scale-110 border-brand-primary'
                                            : 'border-white/30 hover:border-white/60'
                                    }`}
                                >
                                    <Image
                                        src={`${photo}?thumb=720x0`}
                                        alt={photo}
                                        width={64}
                                        height={48}
                                        className="h-full w-full object-cover"
                                    />
                                </button>
                            )
                        })}
                </div>
            </div>
        </div>
    )
}
