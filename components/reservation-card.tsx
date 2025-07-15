import React, { useState } from 'react'
import { Card, CardHeader, CardContent, CardTitle } from './ui/card'
import type { Package, Reservation } from '@/types'
import { format } from 'date-fns'
import {
    Calendar,
    Clock,
    Phone,
    Package as PackageIcon,
    CheckCircle,
    XCircle,
    MessageSquare
} from 'lucide-react'
import { es } from 'date-fns/locale'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { updateAdminReservation } from '@/app/actions'
import Link from 'next/link'
import { formatPhoneWithCountryCode } from '@/lib/phone-mask'

interface ReservationCardProps {
    reservation: Reservation
    packages: Package[]
    onUpdate?: (data: Reservation) => void
}

const ReservationCard = ({ reservation, packages, onUpdate }: ReservationCardProps) => {
    const [isLoading, setIsLoading] = useState(false)
    const packageData = packages.find((pkg) => pkg.id === reservation.package_id)
    const tier = packageData?.tiers.find((t) => t.id === reservation.tier_id)
    const date = format(new Date(reservation.datetime), 'EEEE, dd MMMM yyyy', {
        locale: es
    })

    const getStatusBadge = (status?: string) => {
        switch (status) {
            case 'pending':
            case '':
                return (
                    <Badge
                        variant="outline"
                        className="border-yellow-200 bg-yellow-50 text-yellow-700"
                    >
                        Pendiente
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
            case 'rejected':
                return (
                    <Badge variant="outline" className="border-red-200 bg-red-50 text-red-700">
                        Rechazada
                    </Badge>
                )
            default:
                return <Badge variant="outline">Desconocido</Badge>
        }
    }

    const handleApprove = async () => {
        setIsLoading(true)
        const updated = await updateAdminReservation(reservation.id, { status: 'approved' })

        if (updated && onUpdate) {
            onUpdate(updated)
        }

        setIsLoading(false)
    }

    const handleReject = async () => {
        setIsLoading(true)
        const updated = await updateAdminReservation(reservation.id, { status: 'rejected' })

        if (updated && onUpdate) {
            onUpdate(updated)
        }

        setIsLoading(false)
    }

    if (!packageData) {
        return null
    }

    return (
        <Card key={reservation.id} className="relative overflow-hidden">
            {isLoading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-200 bg-opacity-60">
                    <span className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-brand-primary" />
                </div>
            )}
            <CardHeader className="pb-4">
                <div className="flex flex-col justify-between md:flex-row md:items-center">
                    <div className="flex items-center justify-between gap-3 md:justify-start">
                        <CardTitle className="text-lg">{reservation.name}</CardTitle>
                        {getStatusBadge(reservation.status)}
                    </div>
                    <div className="text-sm text-gray-500">
                        Solicitado:{' '}
                        {reservation.created
                            ? format(new Date(reservation.created), 'dd MMM yyyy, HH:mm', {
                                  locale: es
                              })
                            : 'Fecha desconocida'}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pt-0">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Left Column - Contact & Session Info */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Phone className="h-4 w-4 text-brand-primary" />
                            <span className="text-sm">{reservation.phone}</span>

                            <div className="flex">
                                <Button
                                    size={'sm'}
                                    variant="outline"
                                    className="text-brand-primary"
                                >
                                    <Link href={`tel:${reservation.phone}`}>Llamar</Link>
                                </Button>
                                <Button
                                    size={'sm'}
                                    variant="outline"
                                    className="text-brand-primary"
                                >
                                    <Link
                                        href={`https://wa.me/${formatPhoneWithCountryCode(reservation.phone, '505')}`}
                                    >
                                        Enviar WhatsApp
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Calendar className="h-4 w-4 text-brand-primary" />
                            <span className="text-sm">{date}</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <Clock className="h-4 w-4 text-brand-primary" />
                            <span className="text-sm">
                                {format(new Date(reservation.datetime), 'hh:mm aa', { locale: es })}
                            </span>
                        </div>

                        <div className="flex items-center gap-3">
                            <PackageIcon className="h-4 w-4 text-brand-primary" />
                            <div className="flex items-center gap-2">
                                <span className="text-sm">{packageData.name}</span>
                                <Badge variant="secondary" className="text-xs">
                                    {tier?.name || packageData.tiers[0]?.name}
                                </Badge>
                            </div>
                        </div>

                        {reservation.message && (
                            <div className="flex items-start gap-3">
                                <MessageSquare className="mt-0.5 h-4 w-4 text-brand-primary" />
                                <div className="text-sm">
                                    <p className="mb-1 font-medium">Mensaje:</p>
                                    <p className="inline-block max-w-xs rounded-lg bg-gray-100 px-4 py-2 italic text-gray-700 shadow-sm">
                                        {reservation.message}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Actions */}
                    <div className="flex flex-col justify-center">
                        {reservation.status === 'pending' && (
                            <div className="flex gap-3">
                                <Button
                                    onClick={handleApprove}
                                    className="flex-1 bg-green-600 text-white hover:bg-green-700"
                                    disabled={isLoading}
                                >
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Aprobar
                                </Button>
                                <Button
                                    onClick={handleReject}
                                    variant="outline"
                                    className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                                    disabled={isLoading}
                                >
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Rechazar
                                </Button>
                            </div>
                        )}

                        {reservation.status === 'approved' && (
                            <div className="flex items-center bg-green-50 p-4 text-center font-medium text-green-700">
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Reserva Aprobada
                            </div>
                        )}

                        {reservation.status === 'rejected' && (
                            <div className="flex items-center bg-red-50 p-4 text-center font-medium text-red-700">
                                <XCircle className="mr-2 h-4 w-4" />
                                Reserva Rechazada
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default ReservationCard
