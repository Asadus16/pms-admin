/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@shopify/polaris', '@shopify/polaris-icons'],
  images: {
    unoptimized: true,
  },
  // Handle CSS imports
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@components': require('path').resolve(__dirname, 'src/components'),
      '@pages': require('path').resolve(__dirname, 'src/pages'),
      '@styles': require('path').resolve(__dirname, 'src/styles'),
      '@': require('path').resolve(__dirname, 'src'),
    };
    return config;
  },
}

module.exports = nextConfig

