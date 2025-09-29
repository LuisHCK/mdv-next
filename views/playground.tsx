'use client'
import { useState } from 'react'
import postFile from '@/lib/file-uploader'

export default function PlaygroundView() {
    const [uploadProgress, setUploadProgress] = useState<number>(0)

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)

        const response = await postFile<string>({
            file: formData.get('file') as File,
            url: '/api/file-upload',
            onProgress: (progress) => setUploadProgress(progress),
            onError: (error) => console.error('Upload error:', error)
        })

        console.log('Upload success:', response)
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="file" name="file" />
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}
