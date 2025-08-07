'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Calendar, MapPin, Package, Search, Eye, Trash2, Edit, ImageIcon, User } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import Link from 'next/link'
import type { PublishedPhotoSession } from '@/types'
import { deletePhotoSession, getAdminPhotoSessions, updatePhotoSession } from '@/app/actions'
import { toast } from 'sonner'
import ConfirmDelete from '@/components/admin/confirm-delete'

export default function SessionsPage() {
    const [isLoading, setIsLoading] = useState(true)
    const [sessions, setSessions] = useState<PublishedPhotoSession[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all')

    const filteredSessions = sessions.filter((session) => {
        const matchesSearch =
            session.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
            session.created.toLowerCase().includes(searchTerm.toLowerCase()) ||
            session.package_id.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus =
            statusFilter === 'all' || session.visible === (statusFilter === 'published')

        return matchesSearch && matchesStatus
    })

    const toggleStatus = async (id: string) => {
        const currentSession = sessions.find((s) => s.id === id)
        const updatedSession = await updatePhotoSession({ id, visible: !currentSession?.visible })

        if (updatedSession) {
            setSessions((prev) =>
                prev.map((session) =>
                    session.id === id ? { ...session, visible: !session.visible } : session
                )
            )
            toast.success(
                `Sesión ${updatedSession.visible ? 'publicada' : 'despublicada'} exitosamente`
            )
        } else {
            toast.error('Error al actualizar el estado de la sesión. Inténtalo de nuevo.')
        }
    }

    const onConfirmDelete = async (id: string) => {
        await deletePhotoSession(id)
        setSessions((prev) => prev.filter((session) => session.id !== id))
        toast.success('Sesión eliminada exitosamente')
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

    const publishedCount = sessions.filter((s) => s.visible).length
    const draftCount = sessions.filter((s) => !s.visible).length
    const totalCount = sessions.length
    const totalPhotos = sessions.reduce((sum, session) => sum + session.photos.length, 0)

    useEffect(() => {
        const fetchPublishedSessions = async () => {
            const response = await getAdminPhotoSessions({ limit: 100 })
            setSessions(response)
            setIsLoading(false)
        }
        fetchPublishedSessions()
    }, [])

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
                {isLoading && (
                    <Card>
                        <CardContent className="p-8 text-center">
                            <p className="text-gray-500">Cargando sesiones...</p>
                        </CardContent>
                    </Card>
                )}
                {filteredSessions.length === 0 && !isLoading ? (
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
                                            {session.photos.slice(0, 4).map((thumb, index) => (
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
                                            {session.photos.length > 4 && (
                                                <div className="flex aspect-square items-center justify-center bg-gray-100">
                                                    <span className="text-sm text-gray-500">
                                                        +{session.photos.length - 4}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Session Info */}
                                    <div className="space-y-4 lg:col-span-2">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-xl font-semibold text-black">
                                                {session.client}
                                            </h3>
                                            {getStatusBadge(
                                                session.visible ? 'published' : 'draft'
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                                            <div className="flex items-center gap-2">
                                                <User className="h-4 w-4 text-brand-primary" />
                                                <span>{session.client}</span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Package className="h-4 w-4 text-brand-primary" />
                                                <span>{session.package_id}</span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-brand-primary" />
                                                <span>
                                                    {format(
                                                        new Date(session.created),
                                                        'dd MMM yyyy',
                                                        {
                                                            locale: es
                                                        }
                                                    )}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <ImageIcon className="h-4 w-4 text-brand-primary" />
                                                <span>{session.photos.length} fotografías</span>
                                            </div>
                                        </div>

                                        <div className="text-xs text-gray-500">
                                            Subida:{' '}
                                            {format(
                                                new Date(session.created),
                                                'dd MMM yyyy, HH:mm',
                                                { locale: es }
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col gap-3 lg:col-span-1">
                                        <Link href={`/galeria/${session.id}`}>
                                            <Button variant="outline" className="w-full">
                                                <Eye className="mr-2 h-4 w-4" />
                                                Ver Galería
                                            </Button>
                                        </Link>

                                        <Button
                                            onClick={() => toggleStatus(session.id)}
                                            variant="outline"
                                            className={
                                                session.visible
                                                    ? 'border-yellow-200 text-yellow-700 hover:bg-yellow-50'
                                                    : 'border-green-200 text-green-700 hover:bg-green-50'
                                            }
                                        >
                                            {session.visible ? (
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

                                        <ConfirmDelete
                                            title="Eliminar sesión"
                                            message={
                                                <>
                                                    <span>
                                                        ¿Estás seguro de que quieres eliminar esta
                                                    </span>
                                                    <br />
                                                    <span>
                                                        sesión? Esta acción no se puede deshacer.
                                                    </span>
                                                </>
                                            }
                                            onDelete={() => onConfirmDelete(session.id)}
                                            buttonLabel="Eliminar"
                                            buttonClassName="border-red-200 text-red-600 hover:bg-red-50"
                                        />
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
