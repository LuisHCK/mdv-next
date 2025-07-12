'use server'

import { createReservation, updateReservation } from '@/lib/pocketbase'
import { Reservation, ReservationFormData } from '@/types'
import { parse } from 'date-fns'

export async function submitReservation(formData: ReservationFormData) {
    const { date, time } = formData
    const reservationDate = parse(`${date} ${time}`, 'yyyy-MM-dd hh:mm a', new Date())

    let res: Reservation | null = null

    if (formData.id) {
        // Update existing reservation
        res = await updateReservation(formData.id, {
            package_id: formData.package,
            tier_id: formData.tier,
            datetime: reservationDate.toISOString(),
            name: formData.name,
            phone: formData.phone,
            message: formData.message
        })
    } else {
        // Create new reservation
        res = await createReservation({
            package_id: formData.package,
            tier_id: formData.tier,
            datetime: reservationDate.toISOString(),
            name: formData.name,
            phone: formData.phone,
            message: formData.message
        })
    }

    if (!res) {
        throw new Error('Failed to create reservation')
    }
    return res
}
