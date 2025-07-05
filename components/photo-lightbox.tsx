"use client"

import { useState, useEffect } from "react"
import { X, ChevronLeft, ChevronRight, Download, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

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
  photos: Photo[]
  currentIndex: number
  isOpen: boolean
  onClose: () => void
  onNext: () => void
  onPrevious: () => void
}

export function PhotoLightbox({ photos, currentIndex, isOpen, onClose, onNext, onPrevious }: PhotoLightboxProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return

      switch (event.key) {
        case "Escape":
          onClose()
          break
        case "ArrowLeft":
          onPrevious()
          break
        case "ArrowRight":
          onNext()
          break
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose, onNext, onPrevious])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  if (!isOpen || !photos[currentIndex]) return null

  const currentPhoto = photos[currentIndex]

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/50 to-transparent p-4">
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium">
              {currentIndex + 1} de {photos.length}
            </span>
            <span className="text-sm text-white/70">{currentPhoto.filename}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFavorite(!isFavorite)}
              className="text-white hover:bg-white/20"
            >
              <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <Download className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
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
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20 disabled:opacity-30"
      >
        <ChevronLeft className="h-8 w-8" />
      </Button>

      <Button
        variant="ghost"
        size="lg"
        onClick={onNext}
        disabled={currentIndex === photos.length - 1}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20 disabled:opacity-30"
      >
        <ChevronRight className="h-8 w-8" />
      </Button>

      {/* Main Image */}
      <div className="flex items-center justify-center h-full p-8 pt-20 pb-24">
        <div className="relative max-w-7xl max-h-full">
          <Image
            src={currentPhoto.src || "/placeholder.svg"}
            alt={currentPhoto.alt}
            width={1200}
            height={800}
            className="max-w-full max-h-full object-contain"
            onLoad={() => setIsLoading(false)}
            priority
          />
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <div className="animate-spin h-8 w-8 border-b-2 border-white"></div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/50 to-transparent p-4">
        <div className="text-center text-white">
          <h3 className="text-lg font-semibold mb-1">{currentPhoto.caption}</h3>
          <div className="flex justify-center space-x-2">
            {currentPhoto.tags.map((tag, index) => (
              <span key={index} className="px-2 py-1 bg-white/20">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Thumbnail Strip */}
      <div className="absolute bottom-20 left-0 right-0 z-10">
        <div className="flex justify-center space-x-2 px-4 overflow-x-auto">
          {photos.slice(Math.max(0, currentIndex - 5), currentIndex + 6).map((photo, index) => {
            const actualIndex = Math.max(0, currentIndex - 5) + index
            return (
              <button
                key={photo.id}
                onClick={() => {
                  // This would need to be handled by parent component
                }}
                className={`flex-shrink-0 w-16 h-12 overflow-hidden border-2 transition-all ${
                  actualIndex === currentIndex
                    ? "border-brand-primary scale-110"
                    : "border-white/30 hover:border-white/60"
                }`}
              >
                <Image
                  src={photo.thumbnail || "/placeholder.svg"}
                  alt={photo.alt}
                  width={64}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
