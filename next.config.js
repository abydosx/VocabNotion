/** @type {import('next').NextConfig} */
// const withPWA = require('next-pwa')
module.exports = {
  // ...withPWA({
  pwa: {
    dest: 'public',
  },
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
        ],
      },
    ]
  },
  async rewrites() {
    if (process.env.NODE_ENV === 'development') {
      return {
        fallback: [
          {
            source: '/notion/:path*',
            destination: 'http://localhost:8080/notion/:path*',
          },
        ],
      }
    } else {
      return {
        fallback: [
          {
            source: '/notion/:path*',
            destination: 'https://vercel-api-pink.vercel.app/notion/:path*',
          },
        ],
      }
    }
  },
  // })
}
