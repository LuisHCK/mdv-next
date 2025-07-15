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
                destination: '/',
                permanent: false
            }
        ]
    },
    output: 'standalone'
}

export default nextConfig
