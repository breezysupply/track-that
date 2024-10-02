'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SideMenu() {
  const pathname = usePathname();

  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-6">Track That</h1>
      <nav>
        <ul>
          <li className="mb-2">
            <Link href="/" className={`block p-2 rounded ${pathname === '/' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
              Home
            </Link>
          </li>
          <li className="mb-2">
            <Link href="/history" className={`block p-2 rounded ${pathname === '/history' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
              History
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}