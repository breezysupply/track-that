'use client';

import React, { useEffect, useState } from 'react';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  // Add any other properties that a transaction might have
}

interface HistoryEntry {
  id: string;
  title: string;
  budget: number;
  finalBalance: number | null;
  transactions: Transaction[];
  createdAt?: number; // Make this optional
}

export default function History() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    const storedHistory = localStorage.getItem('budgetHistory');
    if (storedHistory) {
      const parsedHistory: HistoryEntry[] = JSON.parse(storedHistory);
      // Sort the history entries by createdAt timestamp, most recent first
      // If createdAt is missing, use 0 (which will put it at the end of the list)
      const sortedHistory = parsedHistory.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      setHistory(sortedHistory);
    }
  }, []);

  const handleEditClick = (entry: HistoryEntry) => {
    setEditingId(entry.id);
    setEditingTitle(entry.title);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingTitle(e.target.value);
  };

  const handleTitleSave = () => {
    const updatedHistory = history.map(entry =>
      entry.id === editingId ? { ...entry, title: editingTitle } : entry
    );
    setHistory(updatedHistory);
    localStorage.setItem('budgetHistory', JSON.stringify(updatedHistory));
    setEditingId(null);
  };

  const handleClearHistory = () => {
    setShowConfirmation(true);
  };

  const confirmClearHistory = () => {
    localStorage.removeItem('budgetHistory');
    setHistory([]);
    setShowConfirmation(false);
  };

  return (
    <div className="max-w-4xl mx-auto history-container">
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Budget History</h1>
      {history.map((entry) => (
        <div key={entry.id} className="mb-4 p-4 bg-white dark:bg-gray-700 rounded shadow">
          {editingId === entry.id ? (
            <div className="flex items-center mb-2">
              <input
                type="text"
                value={editingTitle}
                onChange={handleTitleChange}
                className="flex-grow p-1 border rounded bg-white dark:bg-gray-600 text-gray-800 dark:text-gray-200"
                maxLength={75}
              />
              <button
                onClick={handleTitleSave}
                className="ml-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{entry.title}</h2>
              <button
                onClick={() => handleEditClick(entry)}
                className="px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-500"
              >
                Edit
              </button>
            </div>
          )}
          <p className="text-gray-800 dark:text-gray-200">Budget: ${entry.budget.toFixed(2)}</p>
          <p className="text-gray-800 dark:text-gray-200">
            Final Balance: ${entry.finalBalance != null ? entry.finalBalance.toFixed(2) : 'N/A'}
          </p>
          <p className="text-gray-800 dark:text-gray-200">Transactions: {entry.transactions.length}</p>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
            Created: {entry.createdAt ? new Date(entry.createdAt).toLocaleDateString() : 'Date not available'}
          </p>
        </div>
      ))}
      
      <button
        onClick={handleClearHistory}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Clear History
      </button>

      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">Confirm Clear History</h2>
            <p className="mb-4 text-gray-800 dark:text-gray-200">Are you sure you want to clear all history? This action cannot be undone.</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={confirmClearHistory}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Clear History
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
