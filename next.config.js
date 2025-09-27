/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  env: {
    STRAPI_URL: process.env.STRAPI_URL || 'http://localhost:1337',
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  },
  images: {
    domains: ['localhost', 'your-strapi-cloud-domain.com'],
  },
}

module.exports = nextConfig
