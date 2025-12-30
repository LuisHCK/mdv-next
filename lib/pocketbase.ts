import { Package, PackageTier, PublishedPhotoSession, Reservation, User } from '@/types'
import PocketBase, { RecordAuthResponse } from 'pocketbase'
import Cookies from 'js-cookie'
import { getPocketBaseAssetUrl } from './utils'

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
        const response = await fetch('https://cms.memoriasdevidafoto.com/api/packages?depth=1')
        if (!response.ok) {
            throw new Error('Network response was not ok')
        }
        const { docs } = await response.json()
        return docs
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
            return null
        }
        return profile.items[0]
    } catch (error) {
        console.error('Error fetching profile:', error)
        return null
    }
}

export const getReservations = async (token: string, limit?: number): Promise<Reservation[]> => {
    try {
        pb.authStore.save(token)
        const response = await pb
            .collection<Reservation>('reservations')
            .getList(1, limit, { sort: '-created' })

        return response.items
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

export const getPhotoSessions = async (
    token: string,
    limit?: number
): Promise<PublishedPhotoSession[]> => {
    try {
        pb.authStore.save(token)
        const response = await pb
            .collection<PublishedPhotoSession>('sessions')
            .getList<PublishedPhotoSession>(1, limit, { sort: '-created' })

        return response.items.map((session) => ({
            ...session,
            photos: session.photos.map((filename) =>
                getPocketBaseAssetUrl(session.collectionId, session.id, filename)
            )
        }))
    } catch (error) {
        console.error('Error fetching photo sessions:', error)
        throw error
    }
}

export const getPhotoSession = async (
    id: string,
    token?: string
): Promise<PublishedPhotoSession | null> => {
    try {
        if (token) {
            pb.authStore.save(token)
        }

        const response = await pb.collection('sessions').getOne<PublishedPhotoSession>(id)
        return {
            ...response,
            photos: response.photos.map((filename) =>
                getPocketBaseAssetUrl(response.collectionId, response.id, filename)
            )
        }
    } catch (error) {
        console.error('Error fetching photo session:', error)
        return null
    }
}

export const createPhotoSession = async (
    data: Partial<PublishedPhotoSession>,
    files: File[],
    token: string
): Promise<PublishedPhotoSession | null> => {
    try {
        pb.authStore.save(token)

        const createdSession = await pb.collection('sessions').create<PublishedPhotoSession>({
            ...data,
            photos: files
        })

        return createdSession
    } catch (error) {
        console.error('Error creating photo session:', error)
        return null
    }
}

export const updatePhotoSessionHandler = async (
    data: Partial<PublishedPhotoSession>,
    token: string
): Promise<PublishedPhotoSession | null> => {
    try {
        pb.authStore.save(token)

        if (!data.id) {
            throw new Error('Session ID is required for update')
        }

        const updatedSession = await pb
            .collection('sessions')
            .update<PublishedPhotoSession>(data.id, data)

        return updatedSession
    } catch (error) {
        console.error('Error updating photo session:', error)
        return null
    }
}

export const deletePhotoSessionHandler = async (id: string, token: string): Promise<boolean> => {
    try {
        pb.authStore.save(token)
        await pb.collection('sessions').delete(id)
        return true
    } catch (error) {
        console.error('Error deleting photo session:', error)
        return false
    }
}

export const addPhotosToSession = async (
    id: string,
    files: File[],
    token: string
): Promise<PublishedPhotoSession | null> => {
    try {
        pb.authStore.save(token)

        const updatedSession = await pb
            .collection('sessions')
            .update<PublishedPhotoSession>(id, { 'photos+': files })

        return updatedSession
    } catch (error) {
        console.error('Error adding photos to session:', error)
        return null
    }
}
