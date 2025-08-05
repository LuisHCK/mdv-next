'use client'

import type React from 'react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import type { UploadedFile, SessionData } from '@/types'
import { SessionForm } from '@/components/admin/sessions/SessionForm'
import { FileUpload } from '@/components/admin/sessions/FileUpload'
import { UploadHeader } from '@/components/admin/sessions/UploadHeader'

export default function UploadPage() {
	const [files, setFiles] = useState<UploadedFile[]>([])
	const [sessionData, setSessionData] = useState<SessionData>({
		clientName: '',
		sessionDate: '',
		location: '',
		packageType: '',
		description: ''
	})

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()

		if (files.length === 0) {
			alert('Por favor selecciona al menos una imagen')
			return
		}

		if (!sessionData.clientName || !sessionData.sessionDate) {
			alert('Por favor completa los campos requeridos')
			return
		}

		// Here you would typically send the data to your backend
		console.log('Session Data:', sessionData)
		console.log('Files:', files)

		// Reset form
		setFiles([])
		setSessionData({
			clientName: '',
			sessionDate: '',
			location: '',
			packageType: '',
			description: ''
		})

		alert('Sesión fotográfica subida exitosamente!')
	}

	const isUploading = files.some(f => f.status === 'uploading')

	return (
		<div className="min-h-screen bg-secondary pb-32">
			<div className="container mx-auto px-4 py-8">
				<UploadHeader />

				<form onSubmit={handleSubmit} className="space-y-8">
					<SessionForm
						sessionData={sessionData}
						onSessionDataChange={setSessionData}
					/>

					<FileUpload files={files} onFilesChange={setFiles} />

					{/* Submit Button */}
					<div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white p-4 md:flex md:items-center md:justify-center">
						<Button
							type="submit"
							className="w-full md:w-auto"
							disabled={files.length === 0 || isUploading}
						>
							Crear Sesión Fotográfica
						</Button>
					</div>
				</form>
			</div>
		</div>
	)
}
