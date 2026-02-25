/** @type {import('next').NextConfig} */
const nextConfig = {
  // Output standalone for Amplify deployment
  output: 'standalone',

  // Externalize native/wasm modules that don't work with webpack bundling
  experimental: {
    serverComponentsExternalPackages: ['sql.js', 'pdf-parse', 'pdfjs-dist'],
  },

  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        '@aws-sdk/client-dynamodb': 'commonjs @aws-sdk/client-dynamodb',
        '@aws-sdk/lib-dynamodb': 'commonjs @aws-sdk/lib-dynamodb',
        'sql.js': 'commonjs sql.js',
        'pdf-parse': 'commonjs pdf-parse',
        'pdfjs-dist': 'commonjs pdfjs-dist',
        'pdfjs-dist/legacy/build/pdf.mjs': 'commonjs pdfjs-dist/legacy/build/pdf.mjs',
      });
    }
    return config;
  },
};

module.exports = nextConfig;
