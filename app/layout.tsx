import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'

export const metadata: Metadata = {
    title: 'Memorias de Vida | Fotografia profesional en estudio',
    description: 'Captura y conserva tus momentos más preciados con nuestra fotografía profesional en estudio.',
    keywords: ['fotografía', 'estudio', 'profesional', 'memorias', 'vida']
}

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" className="light" data-theme="light">
            <body>
                <Toaster position="top-center" />
                {children}
            </body>
        </html>
    )
}
