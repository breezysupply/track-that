'use client';

import React from 'react';
import Link from 'next/link';
import { SignOutButton } from './SignOutButton';

export default function SideMenu() {
  return (
    <nav className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-6">Track That</h1>
      <ul>
        <li className="mb-2">
          <Link href="/" className="block py-2 px-4 hover:bg-gray-700 rounded">
            Home
          </Link>
        </li>
        <li className="mb-2">
          <Link href="/new-budget" className="block py-2 px-4 hover:bg-gray-700 rounded">
            Add New Budget
          </Link>
        </li>
        <li className="mb-2">
          <Link href="/history" className="block py-2 px-4 hover:bg-gray-700 rounded">
            History
          </Link>
        </li>
        <li className="mt-6">
          <SignOutButton />
        </li>
      </ul>
    </nav>
  );
}
