import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'

const siteConfig = {
    name: 'Memorias de Vida',
    description: 'Captura y conserva tus momentos más preciados con nuestra fotografía profesional en estudio.',
    url: 'https://memoriasdevida.com',
}

export const metadata: Metadata = {
    title: {
        default: siteConfig.name,
        template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    keywords: ['fotografía', 'estudio', 'profesional', 'memorias', 'vida'],
    authors: [
        {
            name: 'Memorias de Vida',
        },
    ],
    creator: 'Memorias de Vida',
    openGraph: {
        type: 'website',
        locale: 'es_ES',
        url: siteConfig.url,
        title: siteConfig.name,
        description: siteConfig.description,
        siteName: siteConfig.name,
    },
    twitter: {
        card: 'summary_large_image',
        title: siteConfig.name,
        description: siteConfig.description,
        images: [`${siteConfig.url}/og.jpg`],
        creator: '@memoriasdevida',
    },
    icons: {
        icon: '/favicon.ico',
        shortcut: '/favicon-16x16.png',
        apple: '/apple-touch-icon.png',
    },
}

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="es" className="light" data-theme="light">
            <head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'LocalBusiness',
                            name: siteConfig.name,
                            description: siteConfig.description,
                            url: siteConfig.url,
                            address: {
                                '@type': 'PostalAddress',
                                addressLocality: 'Ciudad de México',
                                addressCountry: 'MX',
                            },
                            telephone: '+52 55 1234 5678',
                            image: `${siteConfig.url}/logo-primary-large.avif`,
                        }),
                    }}
                />
            </head>
            <body>
                <Toaster position="top-center" />
                {children}
            </body>
        </html>
    )
}
