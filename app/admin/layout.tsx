import type React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Calendar, Upload, ImageIcon, LayoutDashboard } from 'lucide-react'
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
        redirect('/auth/login')
    }

    return (
        <div className="min-h-screen bg-secondary">
            {/* Admin Navigation */}
            <div className="border-b border-gray-200 bg-white">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="flex flex-col-reverse md:flex-row items-start gap-4">
                            <Link href="/">
                                <Button variant="outline" size="sm">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Volver al Sitio
                                </Button>
                            </Link>
                            <h2 className="text-lg font-semibold text-black whitespace-nowrap">
                                Panel de Administración
                            </h2>
                        </div>

                        <nav className="grid w-full grid-cols-2 gap-2 md:flex md:justify-end md:gap-4">
                            <Link href="/admin/dashboard">
                                <Button variant="outline" size="sm" className="w-full">
                                    <LayoutDashboard className="mr-2 h-4 w-4" />
                                    Dashboard
                                </Button>
                            </Link>
                            <Link href="/admin/reservas">
                                <Button variant="outline" size="sm" className="w-full">
                                    <Calendar className="mr-2 h-4 w-4" />
                                    Reservas
                                </Button>
                            </Link>
                            <Link href="/admin/sesiones">
                                <Button variant="outline" size="sm" className="w-full">
                                    <ImageIcon className="mr-2 h-4 w-4" />
                                    Sesiones
                                </Button>
                            </Link>
                            <Link href="/admin/sesiones/subir">
                                <Button variant="outline" size="sm" className="w-full">
                                    <Upload className="mr-2 h-4 w-4" />
                                    Subir Sesión
                                </Button>
                            </Link>
                        </nav>
                    </div>
                </div>
            </div>

            {children}
        </div>
    )
}
