// Minimal Next.js layout — only used for API routes.
// All frontend pages are static HTML in public/.
export const metadata = {
  title: 'D&D CV Creator',
  description: 'Transform your CV into a D&D character sheet',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
