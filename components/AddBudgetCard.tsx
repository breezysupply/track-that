import React from 'react';
import Link from 'next/link';
import { FaPlus } from 'react-icons/fa';

export default function AddBudgetCard() {
  return (
    <Link href="/new-budget">
      <div className="bg-blue-500 rounded-lg shadow-md p-4 hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center h-full">
        <div className="text-white text-center">
          <FaPlus className="mx-auto text-4xl mb-2" />
          <p className="font-bold">Add New Budget</p>
        </div>
      </div>
    </Link>
  );
}
