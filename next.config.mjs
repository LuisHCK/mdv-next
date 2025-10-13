/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true
    },
    typescript: {
        ignoreBuildErrors: true
    },
    images: {
        unoptimized: true
    },
    redirects: async () => {
        return [
            {
                source: '/qr',
                destination: '/?utm_source=qr',
                permanent: false
            }
        ]
    },
    experimental: {
        serverActions: {
            bodySizeLimit: '100mb'
        }
    },
    output: 'standalone'
}

export default nextConfig
