import { Package, PackageTier, Reservation, ReservationFormData } from '@/types'
import PocketBase from 'pocketbase'

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

export const createReservation = async (data: Omit<Reservation, 'id'>) => {
    try {
        const response = await pb.collection('reservations').create(data)
        return response
    } catch (error) {
        console.error('Error creating reservation:', error)
        return null
    }
}