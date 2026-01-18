/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/studio',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;