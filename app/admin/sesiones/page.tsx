'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Calendar, MapPin, Package, Search, Eye, Trash2, Edit, ImageIcon, User } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import Link from 'next/link'

// Mock data - in real app this would come from your database
const mockSessions = [
    {
        id: 'session-001',
        clientName: 'Familia González',
        sessionType: 'Retrato Familiar',
        packageType: 'Aire Libre',
        date: '2024-03-15',
        location: 'Parque Central',
        photographer: 'Ana Martínez',
        totalPhotos: 45,
        uploadDate: '2024-03-22T10:30:00Z',
        status: 'published',
        thumbnails: [
            '/placeholder.svg?height=100&width=100',
            '/placeholder.svg?height=100&width=100',
            '/placeholder.svg?height=100&width=100'
        ]
    },
    {
        id: 'session-002',
        clientName: 'María Rodríguez',
        sessionType: 'Perfil Profesional',
        packageType: 'Perfil Profesional',
        date: '2024-03-18',
        location: 'Estudio',
        photographer: 'Carlos Mendez',
        totalPhotos: 25,
        uploadDate: '2024-03-20T14:15:00Z',
        status: 'draft',
        thumbnails: [
            '/placeholder.svg?height=100&width=100',
            '/placeholder.svg?height=100&width=100'
        ]
    },
    {
        id: 'session-003',
        clientName: 'Pequeño Alejandro',
        sessionType: 'Infantil',
        packageType: 'Infantil - Paquete 2',
        date: '2024-03-20',
        location: 'Estudio',
        photographer: 'Ana Martínez',
        totalPhotos: 32,
        uploadDate: '2024-03-25T09:45:00Z',
        status: 'published',
        thumbnails: [
            '/placeholder.svg?height=100&width=100',
            '/placeholder.svg?height=100&width=100',
            '/placeholder.svg?height=100&width=100',
            '/placeholder.svg?height=100&width=100'
        ]
    },
    {
        id: 'session-004',
        clientName: 'Cumpleaños de Sofia',
        sessionType: 'Celebrate',
        packageType: 'Celebrate - Paquete 1',
        date: '2024-03-22',
        location: 'Estudio',
        photographer: 'Carlos Mendez',
        totalPhotos: 18,
        uploadDate: '2024-03-24T16:20:00Z',
        status: 'published',
        thumbnails: [
            '/placeholder.svg?height=100&width=100',
            '/placeholder.svg?height=100&width=100'
        ]
    },
    {
        id: 'session-005',
        clientName: 'Pareja Martínez',
        sessionType: 'Para el Recuerdo',
        packageType: 'Para el Recuerdo',
        date: '2024-03-25',
        location: 'Estudio',
        photographer: 'Ana Martínez',
        totalPhotos: 15,
        uploadDate: '2024-03-26T11:10:00Z',
        status: 'draft',
        thumbnails: ['/placeholder.svg?height=100&width=100']
    }
]

export default function SessionsPage() {
    const [sessions, setSessions] = useState(mockSessions)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all')

    const filteredSessions = sessions.filter((session) => {
        const matchesSearch =
            session.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            session.sessionType.toLowerCase().includes(searchTerm.toLowerCase()) ||
            session.packageType.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = statusFilter === 'all' || session.status === statusFilter

        return matchesSearch && matchesStatus
    })

    const handleDelete = (id: string) => {
        if (
            confirm(
                '¿Estás seguro de que quieres eliminar esta sesión? Esta acción no se puede deshacer.'
            )
        ) {
            setSessions((prev) => prev.filter((session) => session.id !== id))
        }
    }

    const toggleStatus = (id: string) => {
        setSessions((prev) =>
            prev.map((session) =>
                session.id === id
                    ? { ...session, status: session.status === 'published' ? 'draft' : 'published' }
                    : session
            )
        )
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'published':
                return (
                    <Badge
                        variant="outline"
                        className="border-green-200 bg-green-50 text-green-700"
                    >
                        Publicada
                    </Badge>
                )
            case 'draft':
                return (
                    <Badge
                        variant="outline"
                        className="border-yellow-200 bg-yellow-50 text-yellow-700"
                    >
                        Borrador
                    </Badge>
                )
            default:
                return <Badge variant="outline">Desconocido</Badge>
        }
    }

    const publishedCount = sessions.filter((s) => s.status === 'published').length
    const draftCount = sessions.filter((s) => s.status === 'draft').length
    const totalCount = sessions.length
    const totalPhotos = sessions.reduce((sum, session) => sum + session.totalPhotos, 0)

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="mb-2 text-3xl font-bold text-black">Sesiones Fotográficas</h1>
                <p className="text-gray-600">Gestiona todas las sesiones subidas al sistema</p>
            </div>

            {/* Stats Cards */}
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Sesiones</p>
                                <p className="text-2xl font-bold text-black">{totalCount}</p>
                            </div>
                            <Calendar className="h-8 w-8 text-primary" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Publicadas</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {publishedCount}
                                </p>
                            </div>
                            <Eye className="h-8 w-8 text-green-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Borradores</p>
                                <p className="text-2xl font-bold text-yellow-600">{draftCount}</p>
                            </div>
                            <Edit className="h-8 w-8 text-yellow-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Fotos</p>
                                <p className="text-2xl font-bold text-brand-dark">{totalPhotos}</p>
                            </div>
                            <ImageIcon className="h-8 w-8 text-brand-dark" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search and Filters */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                    <Input
                        placeholder="Buscar por cliente, tipo de sesión o paquete..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>

                <div className="flex gap-2 overflow-x-auto sm:overflow-visible">
                    <Button
                        variant={statusFilter === 'all' ? 'default' : 'outline'}
                        onClick={() => setStatusFilter('all')}
                    >
                        Todas ({totalCount})
                    </Button>
                    <Button
                        variant={statusFilter === 'published' ? 'default' : 'outline'}
                        onClick={() => setStatusFilter('published')}
                    >
                        Publicadas ({publishedCount})
                    </Button>
                    <Button
                        variant={statusFilter === 'draft' ? 'default' : 'outline'}
                        onClick={() => setStatusFilter('draft')}
                    >
                        Borradores ({draftCount})
                    </Button>
                </div>
            </div>

            {/* Sessions List */}
            <div className="space-y-6">
                {filteredSessions.length === 0 ? (
                    <Card>
                        <CardContent className="p-8 text-center">
                            <ImageIcon className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                            <p className="mb-2 text-gray-500">No se encontraron sesiones</p>
                            <p className="text-sm text-gray-400">
                                {searchTerm
                                    ? 'Intenta con otros términos de búsqueda'
                                    : 'Sube tu primera sesión fotográfica'}
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    filteredSessions.map((session) => (
                        <Card key={session.id} className="overflow-hidden">
                            <CardContent className="p-6">
                                <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                                    {/* Thumbnails */}
                                    <div className="lg:col-span-1">
                                        <div className="grid grid-cols-2 gap-2">
                                            {session.thumbnails.slice(0, 4).map((thumb, index) => (
                                                <div
                                                    key={index}
                                                    className="aspect-square overflow-hidden bg-gray-100"
                                                >
                                                    <img
                                                        src={thumb || '/placeholder.svg'}
                                                        alt={`Preview ${index + 1}`}
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                            ))}
                                            {session.thumbnails.length > 4 && (
                                                <div className="flex aspect-square items-center justify-center bg-gray-100">
                                                    <span className="text-sm text-gray-500">
                                                        +{session.thumbnails.length - 4}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Session Info */}
                                    <div className="space-y-4 lg:col-span-2">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-xl font-semibold text-black">
                                                {session.clientName}
                                            </h3>
                                            {getStatusBadge(session.status)}
                                        </div>

                                        <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                                            <div className="flex items-center gap-2">
                                                <User className="h-4 w-4 text-brand-primary" />
                                                <span>{session.sessionType}</span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Package className="h-4 w-4 text-brand-primary" />
                                                <span>{session.packageType}</span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-brand-primary" />
                                                <span>
                                                    {format(new Date(session.date), 'dd MMM yyyy', {
                                                        locale: es
                                                    })}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <MapPin className="h-4 w-4 text-brand-primary" />
                                                <span>{session.location}</span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <ImageIcon className="h-4 w-4 text-brand-primary" />
                                                <span>{session.totalPhotos} fotografías</span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <User className="h-4 w-4 text-brand-primary" />
                                                <span>{session.photographer}</span>
                                            </div>
                                        </div>

                                        <div className="text-xs text-gray-500">
                                            Subida:{' '}
                                            {format(
                                                new Date(session.uploadDate),
                                                'dd MMM yyyy, HH:mm',
                                                { locale: es }
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col gap-3 lg:col-span-1">
                                        <Link href={`/galeria/${session.id}`}>
                                            <Button
                                                variant="outline"
                                                className="w-full"
                                            >
                                                <Eye className="mr-2 h-4 w-4" />
                                                Ver Galería
                                            </Button>
                                        </Link>

                                        <Button
                                            onClick={() => toggleStatus(session.id)}
                                            variant="outline"
                                            className={
                                                session.status === 'published'
                                                    ? 'border-yellow-200 text-yellow-700 hover:bg-yellow-50'
                                                    : 'border-green-200 text-green-700 hover:bg-green-50'
                                            }
                                        >
                                            {session.status === 'published' ? (
                                                <>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Despublicar
                                                </>
                                            ) : (
                                                <>
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    Publicar
                                                </>
                                            )}
                                        </Button>

                                        <Button
                                            onClick={() => handleDelete(session.id)}
                                            variant="outline"
                                            className="border-red-200 text-red-600 hover:bg-red-50"
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Eliminar
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
