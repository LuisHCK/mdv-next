'use client'
import React, { useState } from 'react'
import { PhotoLightbox } from './photo-lightbox'
import Image from 'next/image'
import { PublishedPhotoSession } from '@/types'
import { Card, CardContent } from './ui/card'

interface PhotoGalleryProps {
    photoSession: PublishedPhotoSession
}

const PhotoGallery = ({ photoSession }: PhotoGalleryProps) => {
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
    const [isLightboxOpen, setIsLightboxOpen] = useState(false)
    const photos = photoSession.photos || []

    const openLightbox = (index: number) => {
        setCurrentPhotoIndex(index)
        setIsLightboxOpen(true)
    }

    const closeLightbox = () => {
        setIsLightboxOpen(false)
    }

    const nextPhoto = () => {
        setCurrentPhotoIndex((prev) => (prev + 1) % photos.length)
    }

    const previousPhoto = () => {
        setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length)
    }

    return (
        <React.Fragment>
            {/* Photo Gallery */}
            <section className="py-8">
                <div className="container mx-auto px-4 lg:px-6">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="font-serif text-2xl font-bold text-brand-dark">
                            Galería de Fotos
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {photos.map((photo, index) => (
                            <div
                                key={photo}
                                className="group relative aspect-square cursor-pointer overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl"
                                onClick={() => openLightbox(index)}
                            >
                                <Image
                                    src={photo || '/placeholder.svg'}
                                    alt={photo}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />

                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                    <p className="truncate text-sm font-medium text-white">
                                        {photo}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Photo Lightbox */}
            <PhotoLightbox
                photos={photos}
                currentIndex={currentPhotoIndex}
                isOpen={isLightboxOpen}
                onClose={closeLightbox}
                onNext={nextPhoto}
                onPrevious={previousPhoto}
                setCurrentIndex={setCurrentPhotoIndex}
            />
        </React.Fragment>
    )
}

export default PhotoGallery
