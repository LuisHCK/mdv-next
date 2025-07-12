import { getPackages } from '@/lib/pocketbase'
import ReservationForm from '@/components/reservation-form'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Reserva tu Sesión',
    description:
        'Reserva tu sesión de fotografía profesional en nuestro estudio. Selecciona el paquete que prefieras y agenda tu cita fácilmente.',
}

export const revalidate = 3600 // Revalidate every hour

export default async function ReservasPage() {
    const packages = await getPackages()
    return <ReservationForm packages={packages} />
}
