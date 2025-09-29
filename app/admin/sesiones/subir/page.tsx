'use client'

import type React from 'react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import type { UploadedFile, PublishedPhotoSession, Package } from '@/types'
import { SessionForm } from '@/components/admin/sessions/SessionForm'
import { FileUpload } from '@/components/admin/sessions/FileUpload'
import { UploadHeader } from '@/components/admin/sessions/UploadHeader'
import { getPackageList, uploadNewPhotoSession } from '@/app/actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import FileUploader from '@/components/admin/file-uploader'
import postFile from '@/lib/file-uploader'

export default function UploadPage() {
    const [files, setFiles] = useState<UploadedFile[]>([])
    const [packages, setPackages] = useState<Package[]>([])
    const [isSaving, setIsSaving] = useState(false)
    const [sessionData, setSessionData] = useState<Partial<PublishedPhotoSession>>({
        client: '',
        package_id: '',
        phone: '',
        visible: false
    })
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)

        if (files.length === 0) {
            toast.error('Por favor selecciona al menos una imagen')
            setIsSaving(false)
            return
        }

        if (!sessionData.client || !sessionData.package_id || !sessionData.phone) {
            toast.error('Por favor completa los campos requeridos')
            setIsSaving(false)
            return
        }

        // Here you would typically send the data to your backend
        console.log('Session Data:', sessionData)
        console.log('Files:', files)
        const newPhotoSession = await uploadNewPhotoSession(
            sessionData,
            []
            // files.map(({ file }) => file) // Assuming `file` has a `file` property with the actual file
        )

        // Sequential (queued) upload to avoid timeouts / overload
        for (let i = 0; i < files.length; i++) {
            const file = files[i]
            try {
                // eslint-disable-next-line no-await-in-loop
                const fileUrl = await postFile<string>({
                    file: file.file,
                    url: `/api/file-upload`,
                    onProgress: (progress) => {
                        console.log(`Upload progress (${i + 1}/${files.length}):`, progress)
                        // Update file progress in state
                        setFiles((prevFiles) =>
                            prevFiles.map((f) =>
                                f.id === file.id ? { ...f, progress, status: 'uploading' } : f
                            )
                        )
                    }
                })

                if (fileUrl) {
                    // update file status
                    setFiles((prevFiles) =>
                        prevFiles.map((f) =>
                            f.id === file.id ? { ...f, progress: 100, status: 'success' } : f
                        )
                    )
                }
            } catch (err) {
                console.error('Error uploading file', file.file?.name, err)
                toast.error(`Error subiendo el archivo: ${file.file?.name || 'desconocido'}`)
                setIsSaving(false)
                return
            }
        }

        if (!newPhotoSession) {
            toast.error('Error al subir la sesión fotográfica. Inténtalo de nuevo.')
            setIsSaving(false)
            return
        }

        // Reset form
        setFiles([])
        setSessionData({
            client: '',
            package_id: '',
            phone: '',
            visible: false
        })

        toast.success('Sesión fotográfica subida exitosamente!')
        setIsSaving(false)
        router.push('/admin/sesiones')
    }

    useEffect(() => {
        const fetchPackageList = async () => {
            const packageResponse = await getPackageList()
            setPackages(packageResponse)
        }

        fetchPackageList()
    }, [])

    return (
        <div className="min-h-screen bg-secondary pb-32">
            <div className="container mx-auto px-4 py-8">
                <UploadHeader />

                <form onSubmit={handleSubmit} className="space-y-8">
                    <SessionForm
                        sessionData={sessionData}
                        onSessionDataChange={setSessionData}
                        packages={packages}
                    />

                    <FileUpload files={files} onFilesChange={setFiles} />

                    {/* Submit Button */}
                    <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white p-4 md:flex md:items-center md:justify-center">
                        <Button
                            type="submit"
                            className="w-full md:w-auto"
                            disabled={files.length === 0 || isSaving}
                        >
                            {isSaving ? 'Guardando...' : 'Crear Sesión Fotográfica'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
