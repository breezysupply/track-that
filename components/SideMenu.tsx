'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
// Remove the import for SignOutButton as it's causing an error
// import SignOutButton from './SignOutButton';
import { useAuth } from './AuthContext';
import { useRouter } from 'next/navigation';

export default function SideMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const router = useRouter();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <>
      <nav className={`bg-gray-800 text-white w-64 min-h-screen p-4 fixed top-0 left-0 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
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
          {user && (
            <li className="mt-6">
              <button onClick={handleSignOut} className="block py-2 px-4 hover:bg-gray-700 rounded">
                Sign Out
              </button>
            </li>
          )}
        </ul>
      </nav>
      <button
        onClick={toggleMenu}
        className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white p-2 rounded-full shadow-lg md:hidden z-50"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
    </>
  );
}
