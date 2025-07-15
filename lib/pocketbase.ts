import { Package, PackageTier, Reservation, User } from '@/types'
import PocketBase, { RecordAuthResponse } from 'pocketbase'
import Cookies from 'js-cookie'

const pb = new PocketBase(process.env.API_URL)
pb.autoCancellation(false)

/**
 * Retrieves the full list of package tiers from the 'tiers' collection in PocketBase.
 *
 * @returns {Promise<PackageTier[]>} A promise that resolves to an array of `PackageTier` objects.
 * @throws Will throw an error if the fetch operation fails.
 */
export const getTiers = async (): Promise<PackageTier[]> => {
    try {
        const response = await pb.collection<PackageTier>('tiers').getFullList()
        return response
    } catch (error) {
        console.error('Error fetching tiers:', error)
        throw error
    }
}

/**
 * Retrieves the full list of packages from the 'packages' collection in PocketBase.
 *
 * @returns {Promise<any[]>} A promise that resolves to an array of package objects.
 * @throws Will throw an error if the fetch operation fails.
 */
export const getPackages = async (): Promise<Package[]> => {
    try {
        const response = await pb.collection<Package>('packages').getFullList()
        const tiers = await getTiers()

        // Map each package to include its tier information
        return response.map((pkg) => ({
            ...pkg,
            tiers: tiers.filter((tier) => tier.package_id === pkg.id)
        }))
    } catch (error) {
        console.error('Error fetching packages:', error)
        throw error
    }
}

export const createReservation = async (
    data: Omit<Reservation, 'id'>
): Promise<Reservation | null> => {
    try {
        const response = await pb
            .collection('reservations')
            .create<Reservation>({ ...data, status: 'pending' })
        return response
    } catch (error) {
        console.error('Error creating reservation:', error)
        return null
    }
}

export const updateReservation = async (
    id: string,
    data: Partial<Reservation>
): Promise<Reservation | null> => {
    try {
        // Remove the status field if it exists in the data
        if (data.status) {
            delete data.status
        }
        const response = await pb.collection('reservations').update<Reservation>(id, data)
        return response
    } catch (error) {
        console.error('Error updating reservation:', error)
        return null
    }
}

export const loginUser = async (
    email: string,
    password: string
): Promise<RecordAuthResponse | null> => {
    try {
        const authData = await pb.collection('users').authWithPassword(email, password)
        return authData
    } catch (error) {
        console.error('Login failed:', error)
        return null
    }
}

export const getProfile = async (token: string): Promise<User | null> => {
    try {
        pb.authStore.save(token)
        const profile = await pb.collection('users').getList<User>(1, 1)

        if (profile.items.length === 0) {
            throw new Error('Profile not found')
        }
        return profile.items[0]
    } catch (error) {
        console.error('Error fetching profile:', error)
        return null
    }
}

export const getReservations = async (token: string): Promise<Reservation[]> => {
    try {
        pb.authStore.save(token)
        const response = await pb
            .collection<Reservation>('reservations')
            .getFullList({ sort: '-created' })
        return response
    } catch (error) {
        console.error('Error fetching reservations:', error)
        throw error
    }
}

export const updateAdminReservation = async (
    id: string,
    data: Partial<Reservation>,
    token: string
) => {
    try {
        pb.authStore.save(token)
        const response = await pb
            .collection<Reservation>('reservations')
            .update<Reservation>(id, data)
        return response
    } catch (error) {
        console.error('Error updating reservation status:', error)
        throw error
    }
}
