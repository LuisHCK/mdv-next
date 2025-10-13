'use client'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'
import React, { useEffect, useState } from 'react'

interface MasonryGalleryProps {
    photos: string[]
    onSelect: (index: number) => void
}

// Split photos into 3 columns for masonry layout
const COLUMNS = {
    DESKTOP: 3,
    MOBILE: 2
}

const HEIGHTS = {
    DESKTOP: ['max-h-[1024px]', 'max-h-[340px]', 'max-h-[900px]'],
    MOBILE: ['max-h-[300px]', 'max-h-[250px]']
}

const MasonryGallery = ({ photos, onSelect }: MasonryGalleryProps) => {
    const [heights, setHeights] = useState(HEIGHTS.DESKTOP)
    const isMobile = useIsMobile()
    const cols = COLUMNS[isMobile ? 'MOBILE' : 'DESKTOP']
    const masonry: string[][] = Array.from({ length: cols }, () => [])

    photos.forEach((photo, idx) => {
        masonry[idx % cols].push(photo)
    })

    useEffect(() => {
        setHeights(isMobile ? HEIGHTS.MOBILE : HEIGHTS.DESKTOP)
    }, [isMobile])

    return (
        <div className={cn('grid grid-cols-2 items-start gap-2 md:grid-cols-3 md:gap-3')}>
            {masonry.map((col, colIdx) => (
                <div className="grid gap-4" key={colIdx}>
                    {col.map((src, imgIdx) => (
                        <button
                            tabIndex={0}
                            key={imgIdx}
                            className={cn(
                                'cursor-pointer overflow-hidden rounded-xl',
                                heights[colIdx]
                            )}
                            onClick={() => onSelect(photos.indexOf(src))}
                        >
                            <img
                                className="h-full w-full rounded-xl object-cover max-h-[300px]U"
                                src={`${src}?thumb=720x0`}
                                alt={'Masonry image ' + (colIdx * cols + imgIdx)}
                            />
                        </button>
                    ))}
                </div>
            ))}
        </div>
    )
}

export default MasonryGallery
