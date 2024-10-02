"use client";

import React, { useState } from 'react';
import { Transaction } from '../types/Transaction';

interface TransactionListProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
}

export default function TransactionList({ transactions, onDeleteTransaction }: TransactionListProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      onDeleteTransaction(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">Recent Transactions</h2>
      <div className="space-y-2">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="bg-gray-100 dark:bg-gray-600 p-3 rounded flex justify-between items-center group">
            <span className="text-gray-800 dark:text-gray-200">{transaction.description}</span>
            <div className="flex items-center">
              <span className="text-red-600 dark:text-red-400 mr-2">
                -${typeof transaction.amount === 'number' ? transaction.amount.toFixed(2) : '0.00'}
              </span>
              <button 
                onClick={() => handleDeleteClick(transaction.id)}
                className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                {/* Delete icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
      {deleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
            <p className="mb-4 text-gray-800 dark:text-gray-200">Are you sure you want to delete this transaction?</p>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded">Cancel</button>
              <button onClick={confirmDelete} className="px-4 py-2 bg-red-500 text-white rounded">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
