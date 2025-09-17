import { MasonryPhotoAlbum } from 'react-photo-album'
import 'react-photo-album/masonry.css'

interface Props {
    photos: string[]
}

const breakpoints = [1080, 640, 384, 256, 128, 96, 64, 48]

export default function PhotoGalleryV2({ photos }: Props) {
    const photoGrid = photos.map((url) => {
        const randomWidth = Math.floor(Math.random() * 150) + 200 // 200–350px
        const randomHeight = Math.floor(Math.random() * 150) + 200 // 200–350px
        return {
            src: url,
            width: randomWidth,
            height: randomHeight,
            href: url
        }
    })
    return <MasonryPhotoAlbum photos={photoGrid} columns={3} componentsProps={{}} />
}
