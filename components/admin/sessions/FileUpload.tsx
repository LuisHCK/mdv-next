'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ImageIcon, Upload } from 'lucide-react'
import { FilePreview } from './FilePreview'
import type { UploadedFile } from '@/types'
import { useCallback, useState } from 'react'

interface FileUploadProps {
	files: UploadedFile[]
	onFilesChange: (files: UploadedFile[]) => void
}

export function FileUpload({ files, onFilesChange }: FileUploadProps) {
	const [isDragging, setIsDragging] = useState(false)
	const [isUploading, setIsUploading] = useState(false)

	const handleDragOver = useCallback((e: React.DragEvent) => {
		e.preventDefault()
		setIsDragging(true)
	}, [])

	const handleDragLeave = useCallback((e: React.DragEvent) => {
		e.preventDefault()
		setIsDragging(false)
	}, [])

	const handleFiles = useCallback(
		(newFiles: File[]) => {
			const imageFiles = newFiles.filter(file => file.type.startsWith('image/'))
			const uploadedFiles: UploadedFile[] = imageFiles.map(file => ({
				id: Math.random().toString(36).slice(2, 11),
				file,
				preview: URL.createObjectURL(file), // Full res for now; FilePreview will downscale for display
				status: 'pending',
				progress: 0
			}))
			onFilesChange([...files, ...uploadedFiles])
		},
		[files, onFilesChange]
	)

	const handleDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault()
			setIsDragging(false)
			const droppedFiles = Array.from(e.dataTransfer.files)
			handleFiles(droppedFiles)
		},
		[handleFiles]
	)

	const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const selectedFiles = Array.from(e.target.files)
			handleFiles(selectedFiles)
		}
	}

	const removeFile = (id: string) => {
		const fileToRemove = files.find(f => f.id === id)
		if (fileToRemove) {
			// Revoke original object URL (FilePreview may already have generated its own downscaled data URL)
			if (fileToRemove.preview.startsWith('blob:')) {
				URL.revokeObjectURL(fileToRemove.preview)
			}
		}
		onFilesChange(files.filter(f => f.id !== id))
	}

	const simulateUpload = async (file: UploadedFile) => {
		// Simulate upload progress
		for (let progress = 0; progress <= 100; progress += 10) {
			await new Promise(resolve => setTimeout(resolve, 100))
			onFilesChange(
				files.map(f =>
					f.id === file.id ? { ...f, status: 'uploading', progress } : f
				)
			)
		}

		// Simulate success/error
		const success = Math.random() > 0.1 // 90% success rate
		onFilesChange(
			files.map(f =>
				f.id === file.id
					? {
							...f,
							status: success ? 'success' : 'error',
							progress: success ? 100 : 0
						}
					: f
			)
		)
	}

	const handleUpload = async () => {
		if (files.length === 0) return

		setIsUploading(true)

		// Upload all files
		const uploadPromises = files
			.filter(f => f.status === 'pending')
			.map(file => simulateUpload(file))

		await Promise.all(uploadPromises)
		setIsUploading(false)
	}

	const successCount = files.filter(f => f.status === 'success').length
	const errorCount = files.filter(f => f.status === 'error').length
	const pendingCount = files.filter(f => f.status === 'pending').length

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center justify-between">
					Subir Fotografías
					{files.length > 0 && (
						<div className="flex gap-2">
							{successCount > 0 && (
								<Badge
									variant="outline"
									className="border-green-200 bg-green-50 text-green-700"
								>
									{successCount} exitosas
								</Badge>
							)}
							{errorCount > 0 && (
								<Badge
									variant="outline"
									className="border-red-200 bg-red-50 text-red-700"
								>
									{errorCount} fallidas
								</Badge>
							)}
							{pendingCount > 0 && (
								<Badge
									variant="outline"
									className="border-yellow-200 bg-yellow-50 text-yellow-700"
								>
									{pendingCount} pendientes
								</Badge>
							)}
						</div>
					)}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div
					className={`rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
						isDragging
							? 'border-primary bg-primary/5'
							: 'border-gray-300 hover:border-primary hover:bg-primary/5'
					}`}
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					onDrop={handleDrop}
				>
					<Upload className="mx-auto mb-4 h-12 w-12 text-gray-400" />
					<p className="mb-2 text-lg font-medium text-gray-700">
						Arrastra y suelta las imágenes aquí
					</p>
					<p className="mb-4 text-gray-500">o</p>
					<div className="relative">
						<input
							type="file"
							multiple
							accept="image/*"
							onChange={handleFileInput}
							className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
						/>
						<Button
							type="button"
							variant="outline"
							className="pointer-events-none bg-transparent"
						>
							<ImageIcon className="mr-2 h-4 w-4" />
							Seleccionar Archivos
						</Button>
					</div>
					<p className="mt-2 text-sm text-gray-500">
						Formatos soportados: JPG, PNG, WEBP, AVIF
					</p>
				</div>

				{files.length > 0 && (
					<div className="mt-6">
						<div className="mb-4 flex items-center justify-between">
							<h3 className="font-medium">
								Archivos Seleccionados ({files.length})
							</h3>
							{pendingCount > 0 && (
								<Button
									type="button"
									onClick={handleUpload}
									disabled={isUploading}
									className="bg-primary text-white"
								>
									{isUploading
										? 'Subiendo...'
										: `Subir ${pendingCount} archivos`}
								</Button>
							)}
						</div>

						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
							{files.map(file => (
								<FilePreview
									key={file.id}
									file={file}
									removeFile={removeFile}
								/>
							))}
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	)
}
