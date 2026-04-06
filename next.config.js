/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['lh3.googleusercontent.com', 'maps.googleapis.com'],
  },
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    GOOGLE_PLACE_ID: process.env.GOOGLE_PLACE_ID,
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  },
}

module.exports = nextConfig