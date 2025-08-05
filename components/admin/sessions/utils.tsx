"use client"

import { AlertCircle, CheckCircle, ImageIcon } from 'lucide-react'

export const getStatusIcon = (status: string) => {
	switch (status) {
		case 'success':
			return <CheckCircle className="h-4 w-4 text-green-600" />
		case 'error':
			return <AlertCircle className="h-4 w-4 text-red-600" />
		case 'uploading':
			return (
				<div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
			)
		default:
			return <ImageIcon className="h-4 w-4 text-gray-400" />
	}
}
