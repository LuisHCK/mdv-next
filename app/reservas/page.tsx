import { getPackages } from '@/lib/pocketbase'
import ReservationForm from '@/components/reservation-form'

export const revalidate = 24 * 60 * 60 // Revalidate every 24 hours

export default async function ReservasPage() {
    const packages = await getPackages()
    return <ReservationForm packages={packages} />
}
