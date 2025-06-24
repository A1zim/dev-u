/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        API_URL: 'http://localhost:8000/api/',
    },
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'http://localhost:8000/api/:path*',
            },
        ];
    },
};

export default nextConfig;