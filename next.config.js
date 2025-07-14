const { i18n } = require('./next-i18next.config')

/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n,
  images: {
    domains: ['youtube.com', 'i.ytimg.com'],
  },
}

module.exports = nextConfig