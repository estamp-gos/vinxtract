/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable compression for better performance
  compress: true,
  
  // Enable image optimization
  images: {
    domains: ['vinxtractstore.com'],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
  
  // Add security headers for better SEO
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
  
  // Redirects for SEO
  async redirects() {
    return [
      {
        source: '/vin-check',
        destination: '/',
        permanent: true,
      },
      {
        source: '/vehicle-history',
        destination: '/',
        permanent: true,
      },
      {
        source: '/car-history',
        destination: '/',
        permanent: true,
      },
    ];
  },
  
  // Skip trailing slash redirects for API routes to prevent webhook issues
  skipTrailingSlashRedirect: true,

  // Enable static optimization
  output: 'standalone',
  
  // SEO optimization
  poweredByHeader: false,
  
  // Enable experimental features for better performance
  experimental: {
    // optimizeCss: true, // Temporarily disabled due to critters module issue
  },
};

export default nextConfig;
