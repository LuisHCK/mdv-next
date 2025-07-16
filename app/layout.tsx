import type { Metadata } from 'next'
import { Toaster } from '@/components/ui/sonner'
import Script from 'next/script'
import './globals.css'

const siteConfig = {
    name: 'Memorias de Vida',
    description:
        'Captura y conserva tus momentos más preciados con nuestra fotografía profesional en estudio.',
    url: 'https://memoriasdevida.com'
}

export const metadata: Metadata = {
    title: {
        default: siteConfig.name,
        template: `%s | ${siteConfig.name}`
    },
    description: siteConfig.description,
    keywords: ['fotografía', 'estudio', 'profesional', 'memorias', 'vida'],
    authors: [
        {
            name: 'Memorias de Vida'
        }
    ],
    creator: 'Memorias de Vida',
    openGraph: {
        type: 'website',
        locale: 'es_ES',
        url: siteConfig.url,
        title: siteConfig.name,
        description: siteConfig.description,
        siteName: siteConfig.name,
        countryName: 'Nicaragua',
        images: [
            {
                url: `${siteConfig.url}/og.jpg`,
                width: 1200,
                height: 630,
                alt: siteConfig.name
            }
        ]
    },
    twitter: {
        card: 'summary_large_image',
        title: siteConfig.name,
        description: siteConfig.description,
        images: [`${siteConfig.url}/og.jpg`],
        creator: '@memoriasdevida'
    },
    icons: {
        icon: '/favicon.ico',
        shortcut: '/favicon-16x16.png',
        apple: '/apple-touch-icon.png'
    }
}

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="es" className="light" data-theme="light">
            <head>
                <meta name="apple-mobile-web-app-title" content="Memorias de Vida" />
                <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
                <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
                <link rel="shortcut icon" href="/favicon.ico" />
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <meta name="apple-mobile-web-app-title" content="Memorias de Vida" />
                <link rel="manifest" href="/site.webmanifest" />
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
                                addressLocality: 'Estelí',
                                addressCountry: 'NI'
                            },
                            telephone: '+505 8923 6282',
                            image: `${siteConfig.url}/logo-primary-large.avif`
                        })
                    }}
                />
                {process.env.NODE_ENV === 'production' && (
                    <Script
                        defer
                        src="https://umami.memoriasdevidafoto.com/script.js"
                        data-website-id="1ade7101-98f5-4946-aa6d-3e87687e54fe"
                    />
                )}
            </head>
            <body>
                <Toaster position="top-center" />
                {children}
            </body>
        </html>
    )
}
