'use server'
import { cookies } from 'next/headers'

import {
    createReservation,
    updateReservation,
    loginUser as loginUserHandler,
    getReservations,
    updateAdminReservation as updateAdminReservationHandler,
    getPhotoSession as getPhotoSessionHandler,
    getPhotoSessions,
    createPhotoSession,
    getPackages,
    updatePhotoSessionHandler,
    deletePhotoSessionHandler
} from '@/lib/pocketbase'
import { PublishedPhotoSession, Reservation, ReservationFormData } from '@/types'
import { parse } from 'date-fns'
import { addDays } from 'date-fns'

export const getPackageList = async () => {
    try {
        const response = await getPackages()
        return response
    } catch (error) {
        console.error('Error fetching package list:', error)
        return []
    }
}

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

// Helper function to get the authentication token from cookies
async function getAuthToken(): Promise<string> {
    const cookieStore = await cookies()
    return cookieStore.get('auth_token')?.value || ''
}

export async function getAdminReservations({ limit }: { limit: number }): Promise<Reservation[]> {
    try {
        const token = await getAuthToken()
        const response = await getReservations(token, limit)
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
        const token = await getAuthToken()
        const response = await updateAdminReservationHandler(id, data, token)
        return response
    } catch (error) {
        console.error('Error updating admin reservation:', error)
        return null
    }
}

export async function getPhotoSession(id: string) {
    try {
        const token = await getAuthToken()
        const response = await getPhotoSessionHandler(id, token)
        return response
    } catch (error) {
        console.error('Error updating admin reservation:', error)
        return null
    }
}

export async function getAdminPhotoSessions({ limit }: { limit?: number }) {
    try {
        const token = await getAuthToken()
        const response = await getPhotoSessions(token, limit)
        return response
    } catch (error) {
        console.error('Error updating admin reservation:', error)
        return []
    }
}

export async function uploadNewPhotoSession(data: Partial<PublishedPhotoSession>, photos: File[]) {
    try {
        const token = await getAuthToken()
        const response = await createPhotoSession(data, photos, token)
        return response
    } catch (error) {
        console.error('Error uploading new photo session:', error)
        return null
    }
}

export async function updatePhotoSession(data: Partial<PublishedPhotoSession>) {
    try {
        const token = await getAuthToken()
        const response = await updatePhotoSessionHandler(data, token)
        return response
    } catch (error) {
        console.error('Error updating photo session:', error)
        return null
    }
}

export async function deletePhotoSession(id: string) {
    try {
        const token = await getAuthToken()
        const response = await deletePhotoSessionHandler(id, token)
        return response
    } catch (error) {
        console.error('Error deleting photo session:', error)
        return null
    }
}
