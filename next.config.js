/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["www.thesportsdb.com",
      "r1.thesportsdb.com",
      "r2.thesportsdb.com",
      "hebbkx1anhila5yf.public.blob.vercel-storage.com",
    ],
  },
}

module.exports = nextConfig
