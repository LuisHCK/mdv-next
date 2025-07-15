import { getPackages } from '@/lib/pocketbase'
import AdminView from '@/views/admin'

export default async function AdminPage() {
    const packages = await getPackages()

    return <AdminView packages={packages} />
}
