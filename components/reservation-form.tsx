'use client'
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import {
    ArrowLeft,
    Calendar,
    Clock,
    Phone,
    Package as PackageIcon,
    MessageSquare,
    Check,
    User
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import type { Package, ReservationFormData } from '@/types'
import { submitReservation } from '@/app/actions'
import { differenceInMinutes, parseISO } from 'date-fns'

const timeSlots = [
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '01:00 PM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
    '05:00 PM'
]

const ReservationForm = ({ packages }: { packages: Package[] }) => {
    const [loading, setLoading] = useState(true)
    const [formData, setFormData] = useState<ReservationFormData>({
        date: '',
        time: '',
        package: '',
        tier: '',
        name: '',
        phone: '',
        message: ''
    })

    const [selectedPackage, setSelectedPackage] = useState<Package | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    const handlePackageChange = (id: string) => {
        const pkg = packages.find((p) => p.id === id)

        if (!pkg) return

        setSelectedPackage(pkg)
        setFormData((prev) => ({
            ...prev,
            package: id,
            tier: pkg?.tiers.length === 1 ? pkg.tiers[0].id : ''
        }))
    }

    const selectedTier = selectedPackage?.tiers.find((tier) => tier.id === formData.tier)
    const submitText = formData.id ? 'Actualizar Reserva' : 'Confirmar Reserva'
    const isRecentReservation = useMemo(() => {
        return formData.created && differenceInMinutes(new Date(), parseISO(formData.created)) < 60
    }, [formData.created])

    const handleSubmit = async (e: React.FormEvent) => {
        try {
            e.preventDefault()
            setIsSubmitting(true)

            // Simulate form submission
            // await new Promise((resolve) => setTimeout(resolve, 2000))
            const savedReservation = await submitReservation(formData)

            setIsSubmitting(false)
            setIsSubmitted(true)

            // Store the reservation data in localStorage
            localStorage.setItem(
                'reservationData',
                JSON.stringify({
                    ...formData,
                    id: savedReservation.id,
                    created: savedReservation.created
                })
            )

            setFormData((prev) => ({
                ...prev,
                id: savedReservation.id,
                created: savedReservation.created
            }))
        } catch (error) {
            console.error('Error submitting reservation:', error)
            toast.error('Error al enviar la reserva. Inténtalo de nuevo más tarde.')
        } finally {
            setIsSubmitting(false)
        }
    }

    // Get packageId and tierId from query params and set defaults accordingly
    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search)
        const packageId = searchParams.get('package')
        const tierId = searchParams.get('tier')

        const packageData = packages.find((pkg) => pkg.id === packageId)
        const tierData = packageData?.tiers.find((tier) => tier.id === tierId)

        if (packageData) {
            setFormData((prev) => ({
                ...prev,
                package: packageData.id,
                tier: tierData?.id || ''
            }))
            setSelectedPackage(packageData)
            toast.success(`Paquete ${packageData.name} seleccionado`, { id: 'package-select' })
        }
    }, [])

    // Get the stored reservation data from localStorage
    useEffect(() => {
        try {
            const storedData = localStorage.getItem('reservationData')

            if (storedData) {
                const parsedData: ReservationFormData = JSON.parse(storedData)
                setFormData(parsedData)
                const pkg = packages.find((p) => p.id === parsedData.package)

                if (pkg) {
                    setSelectedPackage(pkg)
                    if (parsedData.tier) {
                        const tier = pkg.tiers.find((t) => t.id === parsedData.tier)
                        if (tier) {
                            setFormData((prev) => ({ ...prev, tier: tier.id }))
                        }
                    }
                }
                setIsSubmitted(true)
            }
        } catch (error) {
            console.error('Error retrieving reservation data from localStorage:', error)
        } finally {
            setLoading(false)
        }
    }, [packages])

    if (loading) {
        return (
            <div className="min-h-screen bg-secondary flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Cargando...</h2>
                    <p className="text-gray-600">
                        Por favor, espera mientras se carga el formulario.
                    </p>
                </div>
            </div>
        )
    }

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-secondary">
                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-2xl mx-auto">
                        <Card className="text-center">
                            <CardContent className="p-8">
                                <div className="w-16 h-16 bg-primary mx-auto mb-4 flex items-center justify-center">
                                    <Check className="w-8 h-8 text-brand-primary" />
                                </div>
                                <h1 className="text-2xl font-bold mb-4">¡Reserva Confirmada!</h1>
                                <p className="text-gray-600 mb-6">
                                    Hemos recibido tu solicitud de reserva. Nos pondremos en
                                    contacto contigo pronto para confirmar los detalles de tu
                                    sesión.
                                </p>
                                <div className="space-y-2 text-left bg-secondary p-4 mb-6">
                                    <p>
                                        <strong>Paquete:</strong> {selectedPackage?.name}
                                    </p>
                                    {formData.tier && (
                                        <p>
                                            <strong>Tier:</strong> {selectedTier?.name}
                                        </p>
                                    )}
                                    <p>
                                        <strong>Fecha:</strong> {formData.date}
                                    </p>
                                    <p>
                                        <strong>Hora:</strong> {formData.time}
                                    </p>
                                    <p>
                                        <strong>Nombre:</strong> {formData.name}
                                    </p>
                                    <p>
                                        <strong>Teléfono:</strong> {formData.phone}
                                    </p>
                                </div>
                                <div className="flex gap-4 justify-center">
                                    <Button asChild>
                                        <Link href="/">Volver al Inicio</Link>
                                    </Button>
                                    {isRecentReservation && (
                                        <Button
                                            variant="outline"
                                            onClick={() => setIsSubmitted(false)}
                                        >
                                            Editar Reservación
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-secondary">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center gap-4 flex-col-reverse md:flex-row">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/paquetes">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Volver a Paquetes
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold">Reservar Sesión</h1>
                            <p className="text-gray-600">
                                Completa el formulario para reservar tu sesión fotográfica
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-primary" />
                                Información de la Reserva
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Package Selection */}
                                <div className="space-y-2">
                                    <Label htmlFor="package" className="flex items-center gap-2">
                                        <PackageIcon className="w-4 h-4" />
                                        Paquete *
                                    </Label>
                                    <Select
                                        value={formData.package}
                                        onValueChange={handlePackageChange}
                                        required
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona un paquete" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {packages.map((pkg) => (
                                                <SelectItem key={`pkg-${pkg.id}`} value={pkg.id}>
                                                    {pkg.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Tier Selection */}
                                {selectedPackage && selectedPackage.tiers.length > 1 && (
                                    <div className="space-y-2">
                                        <Label htmlFor="tier">Tier *</Label>
                                        <Select
                                            value={formData.tier}
                                            onValueChange={(value) =>
                                                setFormData((prev) => ({ ...prev, tier: value }))
                                            }
                                            required
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecciona un tier" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {selectedPackage.tiers.map((tier: any) => (
                                                    <SelectItem
                                                        key={`tier-${tier.id}`}
                                                        value={tier.id}
                                                    >
                                                        {tier.name} - {tier.price}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}

                                {/* Selected Package Details */}
                                {selectedPackage && formData.tier && (
                                    <div className="bg-secondary p-4 space-y-2">
                                        <h3 className="font-semibold">
                                            Detalles del Paquete Seleccionado:
                                        </h3>
                                        {(() => {
                                            return selectedTier ? (
                                                <div className="text-sm space-y-1">
                                                    <p>
                                                        <strong>Precio:</strong>{' '}
                                                        {selectedTier.price}
                                                    </p>
                                                    <p>
                                                        <strong>Duración:</strong>{' '}
                                                        {selectedTier.duration}
                                                    </p>
                                                    <p>
                                                        <strong>Fotos:</strong>{' '}
                                                        {selectedTier.photos}
                                                    </p>
                                                    <p>
                                                        <strong>Entrega:</strong>{' '}
                                                        {selectedTier.delivery}
                                                    </p>
                                                </div>
                                            ) : null
                                        })()}
                                    </div>
                                )}

                                {/* Date Selection */}
                                <div className="space-y-2">
                                    <Label htmlFor="date" className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        Fecha *
                                    </Label>
                                    <Input
                                        id="date"
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                date: e.target.value
                                            }))
                                        }
                                        min={new Date().toISOString().split('T')[0]}
                                        required
                                    />
                                </div>

                                {/* Time Selection */}
                                <div className="space-y-2">
                                    <Label htmlFor="time" className="flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        Hora *
                                    </Label>
                                    <Select
                                        value={formData.time}
                                        onValueChange={(value) =>
                                            setFormData((prev) => ({ ...prev, time: value }))
                                        }
                                        required
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona una hora" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {timeSlots.map((time) => (
                                                <SelectItem key={time} value={time}>
                                                    {time}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        Nombre Completo *
                                    </Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="Tu nombre completo"
                                        value={formData.name}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                name: e.target.value
                                            }))
                                        }
                                        required
                                    />
                                </div>

                                {/* Phone Number */}
                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="flex items-center gap-2">
                                        <Phone className="w-4 h-4" />
                                        Número de Teléfono *
                                    </Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="Ej: +505 1234-5678"
                                        value={formData.phone}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                phone: e.target.value
                                            }))
                                        }
                                        required
                                    />
                                </div>

                                {/* Message */}
                                <div className="space-y-2">
                                    <Label htmlFor="message" className="flex items-center gap-2">
                                        <MessageSquare className="w-4 h-4" />
                                        Mensaje (Opcional)
                                    </Label>
                                    <Textarea
                                        id="message"
                                        placeholder="Cuéntanos sobre tu sesión, ideas especiales, o cualquier pregunta que tengas..."
                                        value={formData.message}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                message: e.target.value
                                            }))
                                        }
                                        rows={4}
                                    />
                                </div>

                                {/* Submit Button */}
                                <div className="pt-4">
                                    <Button
                                        type="submit"
                                        className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-300"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Enviando...' : submitText}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Additional Info */}
                    <Card className="mt-6">
                        <CardContent className="p-6">
                            <h3 className="font-semibold mb-3">Información Importante:</h3>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li className="font-semibold">
                                    • Las reservas están sujetas a disponibilidad
                                </li>
                                <li>
                                    • Te contactaremos dentro de 24 horas para confirmar tu cita
                                </li>
                                <li>
                                    • Las cancelaciones deben hacerse con 48 horas de anticipación
                                </li>
                                <li>
                                    • Para cambios de fecha, contáctanos con al menos 24 horas de
                                    anticipación
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default ReservationForm
