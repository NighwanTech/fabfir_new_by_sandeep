/** @type {import('next').NextConfig} */
const backendUrl = process.env.NEXT_PUBLIC_API_URL || '';
let backendHostname = 'localhost';
let backendPort = '5000';
let backendProtocol = 'http';

try {
  const url = new URL(backendUrl);
  backendHostname = url.hostname;
  backendPort = url.port || '';
  backendProtocol = url.protocol.replace(':', '');
} catch (e) {
  console.error("Invalid NEXT_PUBLIC_API_URL:", backendUrl);
}

const nextConfig = {
  poweredByHeader: false,
  trailingSlash: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.fabfitperformance.com',
          },
        ],
        destination: 'https://fabfitperformance.com/:path*',
        permanent: true,
      },
    ];
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: backendProtocol,
        hostname: backendHostname,
        port: backendPort,
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
};

export default nextConfig;
