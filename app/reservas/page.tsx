import { getPackages } from '@/lib/pocketbase'
import ReservationForm from '@/components/reservation-form'

export const revalidate = 3600 // Revalidate every hour

export default async function ReservasPage() {
    const packages = await getPackages()
    return <ReservationForm packages={packages} />
}
