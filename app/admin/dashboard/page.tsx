'use client'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Calendar,
    Clock,
    Package,
    ImageIcon,
    Upload,
    Camera,
    ArrowRight,
    MapPin
} from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useEffect, useState } from 'react'
import { getAdminPhotoSessions, getAdminReservations, getPhotoSession } from '@/app/actions'
import { PublishedPhotoSession, Reservation } from '@/types'

const packageData = {
    'perfil-profesional': { name: 'Perfil Profesional', color: 'bg-primary' },
    'aire-libre': { name: 'Paquete Aire Libre', color: 'bg-primary' },
    'para-el-recuerdo': { name: 'Para el Recuerdo', color: 'bg-primary' },
    infantil: { name: 'Infantil', color: 'bg-primary' },
    celebrate: { name: 'Celebrate/Cumpleaños', color: 'bg-primary' }
}

export default function AdminDashboard() {
    const [reservations, setReservations] = useState<Reservation[]>([])
    const [sessions, setSessions] = useState<PublishedPhotoSession[]>([])
    // Calculate statistics
    const totalReservations = reservations.length
    const pendingReservations = reservations.filter((r) => r.status === 'pending').length
    const approvedReservations = reservations.filter((r) => r.status === 'approved').length

    const totalSessions = sessions.length
    const publishedSessions = sessions.filter((s) => s.visible).length
    const draftSessions = sessions.filter((s) => !s.visible).length
    const totalPhotos = sessions.reduce((sum, session) => sum + session.photos.length, 0)

    const getStatusBadge = (status: string | undefined) => {
        switch (status) {
            case 'pending':
                return (
                    <Badge
                        variant="outline"
                        className="border-yellow-200 bg-yellow-50 text-yellow-700"
                    >
                        Pendiente
                    </Badge>
                )
            case 'rejected':
                return (
                    <Badge variant="outline" className="border-red-200 bg-red-50 text-red-700">
                        Rechazada
                    </Badge>
                )
            case 'approved':
                return (
                    <Badge
                        variant="outline"
                        className="border-green-200 bg-green-50 text-green-700"
                    >
                        Aprobada
                    </Badge>
                )
            default:
                return <Badge variant="outline">Desconocido</Badge>
        }
    }

    // Load data
    useEffect(() => {
        const fetchReservations = async () => {
            const reservations = await getAdminReservations({ limit: 3 })
            setReservations(reservations)
        }

        const fetchAdminSession = async () => {
            const sessions = await getAdminPhotoSessions({ limit: 3 })
            setSessions(sessions)
        }

        fetchReservations()
        fetchAdminSession()
    }, [])

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="mb-2 text-3xl font-bold text-black">Dashboard Administrativo</h1>
                <p className="text-gray-600">Resumen general de tu estudio fotográfico</p>
            </div>

            {/* Main Statistics */}
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Reservas</p>
                                <p className="text-2xl font-bold text-black">{totalReservations}</p>
                            </div>
                            <Calendar className="h-8 w-8 text-blue-300" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Sesiones Publicadas
                                </p>
                                <p className="text-2xl font-bold text-green-600">
                                    {publishedSessions}
                                </p>
                            </div>
                            <ImageIcon className="h-8 w-8 text-green-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Pendientes</p>
                                <p className="text-2xl font-bold text-yellow-600">
                                    {pendingReservations}
                                </p>
                            </div>
                            <Clock className="h-8 w-8 text-yellow-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Fotos</p>
                                <p className="text-2xl font-bold">{totalPhotos}</p>
                            </div>
                            <Camera className="h-8 w-8 text-primary" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                <Card className="transition-shadow hover:shadow-lg">
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Calendar className="h-5 w-5 text-brand-primary" />
                            Gestionar Reservas
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-4 text-gray-600">
                            Revisa y aprueba las solicitudes de sesiones fotográficas de tus
                            clientes.
                        </p>
                        <div className="mb-4 flex items-center justify-between">
                            <span className="text-sm text-gray-500">
                                Pendientes: {pendingReservations}
                            </span>
                            <span className="text-sm text-gray-500">
                                Aprobadas: {approvedReservations}
                            </span>
                        </div>
                        <Link href="/admin/reservas">
                            <Button variant="outline" className="w-full hover:bg-primary/90">
                                Ver Reservas
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                <Card className="transition-shadow hover:shadow-lg">
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <ImageIcon className="h-5 w-5 text-brand-primary" />
                            Sesiones Fotográficas
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-4 text-gray-600">
                            Administra las galerías de fotos y controla qué sesiones son visibles
                            para los clientes.
                        </p>
                        <div className="mb-4 flex items-center justify-between">
                            <span className="text-sm text-gray-500">
                                Publicadas: {publishedSessions}
                            </span>
                            <span className="text-sm text-gray-500">
                                Borradores: {draftSessions}
                            </span>
                        </div>
                        <Link href="/admin/sesiones">
                            <Button variant="outline" className="w-full hover:bg-primary/90">
                                Ver Sesiones
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                <Card className="transition-shadow hover:shadow-lg">
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Upload className="h-5 w-5 text-brand-primary" />
                            Subir Nueva Sesión
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-4 text-gray-600">
                            Sube las fotos de una nueva sesión fotográfica para compartir con tus
                            clientes.
                        </p>
                        <div className="mb-4 flex items-center justify-between">
                            <span className="text-sm text-gray-500">Múltiples archivos</span>
                            <span className="text-sm text-gray-500">Drag & Drop</span>
                        </div>
                        <Link href="/admin/sesiones/subir">
                            <Button variant="outline" className="w-full hover:bg-primary/90">
                                Subir Fotos
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Recent Reservations */}
                <Card>
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-md flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-brand-primary" />
                                Reservas Recientes
                            </CardTitle>
                            <Link href="/admin/reservas">
                                <Button variant="outline" size="sm">
                                    Ver Todas
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {reservations.slice(0, 3).map((reservation) => (
                                <div
                                    key={reservation.id}
                                    className="flex items-center justify-between bg-gray-50 p-4 transition-colors hover:bg-gray-100"
                                >
                                    <div className="flex-1">
                                        <div className="mb-1 flex items-center gap-2">
                                            <h4 className="font-medium text-black">
                                                {reservation.name}
                                            </h4>
                                            {getStatusBadge(reservation.status)}
                                        </div>
                                        <div className="flex flex-col gap-2 text-sm text-gray-600 md:flex-row md:items-center md:gap-4">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {format(new Date(reservation.datetime), 'dd MMM', {
                                                    locale: es
                                                })}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {format(new Date(reservation.datetime), 'HH:mm', {
                                                    locale: es
                                                })}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Package className="h-3 w-3" />
                                                {packageData[
                                                    reservation.package_id as keyof typeof packageData
                                                ]?.name || 'Paquete'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Sessions */}
                <Card>
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-md flex items-center gap-2">
                                <ImageIcon className="h-5 w-5 text-brand-primary" />
                                Sesiones Recientes
                            </CardTitle>
                            <Link href="/admin/sesiones">
                                <Button variant="outline" size="sm">
                                    Ver Todas
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {sessions.map((session) => (
                                <div
                                    key={session.id}
                                    className="flex items-center justify-between bg-gray-50 p-4 transition-colors hover:bg-gray-100"
                                >
                                    <div className="flex w-full flex-col gap-4 md:flex-row md:items-center">
                                        <div className="flex w-full -space-x-2 md:w-auto">
                                            {session.photos.slice(0, 3).map((thumb, index) => (
                                                <div
                                                    key={index}
                                                    className="h-10 w-10 overflow-hidden border-2 border-white bg-gray-200"
                                                >
                                                    <img
                                                        src={thumb || '/placeholder.svg'}
                                                        alt={`Preview ${index + 1}`}
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                            ))}
                                            {session.photos.length > 3 && (
                                                <div className="flex h-10 w-10 items-center justify-center border-2 border-white bg-primary text-xs font-medium text-white">
                                                    +{session.photos.length - 3}
                                                </div>
                                            )}
                                        </div>
                                        <div className="w-full">
                                            <div className="mb-1 flex w-full items-center justify-between gap-2 md:items-start">
                                                <h4 className="font-medium text-black">
                                                    {session.client}
                                                </h4>
                                                <Badge
                                                    variant="outline"
                                                    className={
                                                        session.visible
                                                            ? 'border-green-200 bg-green-50 text-green-700'
                                                            : 'border-yellow-200 bg-yellow-50 text-yellow-700'
                                                    }
                                                >
                                                    {session.visible ? 'Publicada' : 'Borrador'}
                                                </Badge>
                                            </div>
                                            <div className="flex flex-col gap-2 text-sm text-gray-600 md:flex-row md:items-start md:gap-4">
                                                <span className="flex items-center gap-1">
                                                    <Package className="h-3 w-3" />
                                                    {session.package_id}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Camera className="h-3 w-3" />
                                                    {session.photos.length} fotos
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
