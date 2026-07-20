/** @type {import('next').NextConfig} */
const nextConfig = {
  // (Removed `output: 'standalone'` — that was for Amplify self-hosting; Vercel
  //  manages Next.js output natively.)

  // Externalize native/wasm modules that don't play well with webpack bundling.
  experimental: {
    serverComponentsExternalPackages: ['sql.js', 'pdf-parse', 'pdfjs-dist'],
  },

  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
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
