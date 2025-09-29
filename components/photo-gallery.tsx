'use client'
import React, { useState } from 'react'
import { PhotoLightbox } from './photo-lightbox'
import Image from 'next/image'
import { PublishedPhotoSession } from '@/types'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Download } from 'lucide-react'
import Link from 'next/link'

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

            <section className="py-8">
                <div className="container mx-auto px-4 lg:px-6">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="font-serif text-2xl font-bold text-brand-dark">
                            Como descargo mis fotos?
                        </h2>
                    </div>

                    <Card className="border-0 bg-gradient-to-br from-brand-secondary to-white shadow-sm">
                        <CardContent className="p-6">
                            <video className="w-full">
                                <source src="/videos/como-descargar.mp4" type="video/mp4" />
                                Tu navegador no soporta video.
                            </video>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </React.Fragment>
    )
}

export default PhotoGallery
