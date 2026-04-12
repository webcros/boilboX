/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/maintenance',
        permanent: false,
      },
      {
        source: '/:path((?!maintenance$).*)',
        destination: '/maintenance',
        permanent: false,
      },
      {
        source: '/admin',
        destination: '/studio',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;