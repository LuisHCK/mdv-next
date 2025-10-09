import { cn } from '@/lib/utils'
import React from 'react'

interface MasonryGalleryProps {
    photos: string[]
    onSelect: (index: number) => void
}

const heights = [1024, 340, 900]

const MasonryGallery = ({ photos, onSelect }: MasonryGalleryProps) => {
    // Split photos into 4 columns for masonry layout
    const columns = 3
    const masonry: string[][] = Array.from({ length: columns }, () => [])
    photos.forEach((photo, idx) => {
        masonry[idx % columns].push(photo)
    })

    return (
        <div className="grid grid-cols-3 gap-2 md:gap-3 items-start">
            {masonry.map((col, colIdx) => (
                <div className="grid gap-4" key={colIdx}>
                    {col.map((src, imgIdx) => (
                        <button
                            tabIndex={0}
                            key={imgIdx}
                            className={cn('overflow-hidden rounded-xl cursor-pointer', `h-[${heights[colIdx]}px]`)}
                            onClick={() => onSelect(photos.indexOf(src))}
                        >
                            <img
                                className="h-full w-full rounded-xl object-cover"
                                src={`${src}?thumb=720x0`}
                                alt={'Masonry image ' + (colIdx * columns + imgIdx)}
                            />
                        </button>
                    ))}
                </div>
            ))}
        </div>
    )
}

export default MasonryGallery
