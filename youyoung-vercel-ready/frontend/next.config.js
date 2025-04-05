/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    NEXT_PUBLIC_APP_ID: 'app_b636a7e558dec2f33f8a449094f7b35e',
    NEXT_PUBLIC_ACTION: 'youyoung-member',
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '/api'
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NEXT_PUBLIC_API_BASE_URL 
          ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/:path*` 
          : 'http://localhost:5000/api/:path*',
      },
    ];
  },
}

module.exports = nextConfig
