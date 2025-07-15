import type React from 'react'
import type { Metadata } from 'next'
import Header from '@/components/header'
import siteContent from '@/data/site-content.json'
import { getProfile } from '@/lib/pocketbase'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
    title: 'Administración - Memorias de Vida',
    description: 'Panel de administración para gestionar reservas de sesiones fotográficas'
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value || ''
    const me = await getProfile(token)

    if (!me) {
        redirect('/admin/login')
    }

    console.log(me)
    return (
        <div className="min-h-screen bg-gradient-to-br from-brand-secondary via-white to-brand-secondary">
            <Header siteContent={siteContent} isAdmin />
            {children}
        </div>
    )
}
