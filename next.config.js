/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.pexels.com'],
  },
  env: {
    BACKEND_URL: process.env.BACKEND_URL,
    FRONTEND_API_KEY: process.env.FRONTEND_API_KEY,
  }
}

module.exports = nextConfig