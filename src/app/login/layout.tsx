import type { Metadata } from 'next';
import '../globals.css';

export const metadata: Metadata = {
  title: 'FabFit Admin Login',
  description: 'Login to FabFit Admin Panel',
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-gray-50">
      <body className="h-full">
        {children}
      </body>
    </html>
  );
}
