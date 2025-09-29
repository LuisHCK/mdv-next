'use client'
import { useState } from 'react'
import type { FileUpload } from '@/types'
import postFile from '@/lib/file-uploader'

export default function FileUploader() {
    const [fileList, setFileList] = useState<FileUpload[]>([])

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files
        if (!files) return

        const newFileList = Array.from(files).map((file) => ({
            id: crypto.randomUUID(),
            filename: file.name,
            size: file.size,
            type: file.type,
            blob: file,
            progress: 0,
            status: 'pending'
        }))

        setFileList([...fileList, ...newFileList])
    }

    const handleRemoveFile = (id: string) => {
        setFileList(fileList.filter((file) => file.id !== id))
    }

    const handleRemoveAllFiles = () => {
        setFileList([])
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)

        const response = await postFile<string>({
            file: formData.get('file') as File,
            url: '/api/file-upload',
            onProgress: (progress) => ,
            onError: (error) => console.error('Upload error:', error)
        })

        console.log('Upload success:', response)
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="file"
                    name="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    multiple
                />

                <div>
                    {fileList.map((tempFile) => (
                        <div>
                            <p>{tempFile.filename}</p>
                            <button onClick={() => handleRemoveFile(tempFile.id)}>
                                Remove file
                            </button>
                        </div>
                    ))}
                </div>

                <button type="submit">Submit</button>
            </form>
        </div>
    )
}
