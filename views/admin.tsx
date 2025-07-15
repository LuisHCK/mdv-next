'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, CheckCircle } from 'lucide-react'
import type { Package, Reservation } from '@/types'
import { getAdminReservations } from '@/app/actions'
import ReservationCard from '@/components/reservation-card'

export default function AdminView({ packages }: { packages: Package[] }) {
    const [reservations, setReservations] = useState<Reservation[]>([])
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('pending')
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')

    const filteredReservations = reservations.filter((reservation) => {
        const matchesFilter = filter === 'all' || reservation.status === filter
        const matchesSearch =
            !searchQuery ||
            reservation.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            reservation.phone?.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesFilter && matchesSearch
    })

    const pendingCount = reservations.filter((r) => r.status === 'pending').length
    const approvedCount = reservations.filter((r) => r.status === 'approved').length
    const totalCount = reservations.length

    const handleReservationUpdate = (data: Reservation) => {
        setReservations((prev) =>
            prev.map((reservation) =>
                reservation.id === data.id ? { ...reservation, ...data } : reservation
            )
        )
    }

    useEffect(() => {
        const fetchReservations = async () => {
            setIsLoading(true)
            try {
                const response = await getAdminReservations()
                setReservations(response)
            } catch (error) {
                console.error('Error fetching reservations:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchReservations()
    }, [])

    if (isLoading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-secondary bg-opacity-80">
                <div className="flex flex-col items-center gap-4">
                    <svg className="h-12 w-12 animate-spin text-primary" viewBox="0 0 24 24">
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        />
                    </svg>
                    <span className="text-lg font-medium text-gray-700">Cargando reservas...</span>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-secondary">
            <div className="container mx-auto px-4 py-20">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="mb-2 text-3xl font-bold text-black">
                        Administración de Reservas
                    </h1>
                    <p className="text-gray-600">
                        Gestiona las solicitudes de sesiones fotográficas
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        Total Reservas
                                    </p>
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
                                    <p className="text-sm font-medium text-gray-600">Pendientes</p>
                                    <p className="text-2xl font-bold text-yellow-600">
                                        {pendingCount}
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
                                    <p className="text-sm font-medium text-gray-600">Aprobadas</p>
                                    <p className="text-2xl font-bold text-green-600">
                                        {approvedCount}
                                    </p>
                                </div>
                                <CheckCircle className="h-8 w-8 text-green-600" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Search box */}
                <div className="mb-6 flex items-center gap-2">
                    <input
                        type="text"
                        className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 focus:border-primary focus:outline-none"
                        placeholder="Buscar por nombre o teléfono..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <Button
                            variant="outline"
                            onClick={() => setSearchQuery('')}
                            className="px-3 py-2"
                        >
                            Limpiar
                        </Button>
                    )}
                </div>

                {/* Filter Buttons */}
                <div className="mb-6 flex gap-4">
                    <Button
                        variant={filter === 'pending' ? 'default' : 'outline'}
                        onClick={() => setFilter('pending')}
                        className={filter === 'pending' ? 'bg-primary text-gray-100' : ''}
                    >
                        Pendientes ({pendingCount})
                    </Button>
                    <Button
                        variant={filter === 'all' ? 'default' : 'outline'}
                        onClick={() => setFilter('all')}
                        className={filter === 'all' ? 'bg-primary text-gray-100' : ''}
                    >
                        Todas ({totalCount})
                    </Button>
                    <Button
                        variant={filter === 'approved' ? 'default' : 'outline'}
                        onClick={() => setFilter('approved')}
                        className={filter === 'approved' ? 'bg-primary text-gray-100' : ''}
                    >
                        Aprobadas ({approvedCount})
                    </Button>
                </div>

                {/* Reservations List */}
                <div className="space-y-6">
                    {filteredReservations.length === 0 ? (
                        <Card>
                            <CardContent className="p-8 text-center">
                                <p className="text-gray-500">No hay reservas para mostrar</p>
                            </CardContent>
                        </Card>
                    ) : (
                        filteredReservations.map((reservation) => (
                            <ReservationCard
                                key={reservation.id}
                                reservation={reservation}
                                packages={packages}
                                onUpdate={handleReservationUpdate}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
