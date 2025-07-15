'use server'
import { cookies } from 'next/headers'

import {
    createReservation,
    updateReservation,
    loginUser as loginUserHandler,
    getReservations,
    updateAdminReservation as updateAdminReservationHandler
} from '@/lib/pocketbase'
import { Reservation, ReservationFormData } from '@/types'
import { parse } from 'date-fns'
import { addDays } from 'date-fns'

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

/**
 * Attempts to log in a user with the provided email and password.
 * On successful login, sets an authentication token in the cookies with a 7-day expiration.
 *
 * @param email - The user's email address.
 * @param password - The user's password.
 * @returns A promise that resolves to `true` if login is successful and the token is set, or `false` otherwise.
 */
export async function loginUser(email: string, password: string): Promise<boolean> {
    try {
        const res = await loginUserHandler(email, password)
        const cookieStore = await cookies()

        if (!res) {
            throw new Error('Login failed')
        }

        // Set the auth token in cookies
        cookieStore.set('auth_token', res?.token, {
            expires: addDays(new Date(), 7),
            secure: process.env.NODE_ENV === 'production'
        })

        return true
    } catch (error) {
        console.error('Login failed:', error)
        return false
    }
}

export async function getAdminReservations() {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('auth_token')?.value || ''
        const response = await getReservations(token)
        return response
    } catch (error) {
        console.error('Error fetching admin reservations:', error)
        throw error
    }
}

export async function updateAdminReservation(
    id: string,
    data: Partial<Reservation>
): Promise<Reservation | null> {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('auth_token')?.value || ''
        const response = await updateAdminReservationHandler(id, data, token)
        return response
    } catch (error) {
        console.error('Error updating admin reservation:', error)
        return null
    }
}
