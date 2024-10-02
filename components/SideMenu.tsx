'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaBars, FaTimes } from 'react-icons/fa';

export default function SideMenu() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      <button
        onClick={toggleMenu}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-full bg-gray-800 text-white"
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>
      <div className={`bg-gray-800 text-white w-64 min-h-screen p-4 fixed left-0 top-0 z-40 transform transition-transform duration-200 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <h1 className="text-2xl font-bold mb-6">Track That</h1>
        <nav>
          <ul>
            <li className="mb-2">
              <Link href="/" className={`block p-2 rounded ${pathname === '/' ? 'bg-gray-700' : 'hover:bg-gray-700'}`} onClick={toggleMenu}>
                Home
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/history" className={`block p-2 rounded ${pathname === '/history' ? 'bg-gray-700' : 'hover:bg-gray-700'}`} onClick={toggleMenu}>
                History
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}