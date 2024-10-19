'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from '../components/AuthContext';
import SideMenu from '../components/SideMenu';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-900 text-white`}>
        <AuthProvider>
          <div className="flex">
            <SideMenu />
            <main className="flex-1 md:ml-64 p-4">{children}</main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
