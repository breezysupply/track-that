'use client';

import { useEffect } from 'react';
import './globals.css';
import SideMenu from '../components/SideMenu'; // Adjust the import path as needed

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <html lang="en" className="dark">
      <body className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <div className="flex">
          <SideMenu />
          <main className="flex-1 p-4">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}