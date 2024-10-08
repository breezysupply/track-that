'use client';

import React, { useEffect, useState } from 'react';
import { Budget } from '../../types/Budget';

interface EndedBudget extends Budget {
  endedAt: string;
}

export default function History() {
  const [history, setHistory] = useState<EndedBudget[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const storedHistory = JSON.parse(localStorage.getItem('budget_history') || '[]');
    // Sort the history array in descending order by endedAt date
    const sortedHistory = storedHistory.sort((a: EndedBudget, b: EndedBudget) => 
      new Date(b.endedAt).getTime() - new Date(a.endedAt).getTime()
    );
    setHistory(sortedHistory);
  };

  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear all history? This action cannot be undone.')) {
      localStorage.setItem('budget_history', '[]');
      setHistory([]);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Budget History</h1>
        <button 
          onClick={clearHistory}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
        >
          Clear History
        </button>
      </div>
      {history.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No budget history available.</p>
      ) : (
        history.map((budget) => {
          // Provide default values if properties are undefined
          const name = budget.name || 'Unnamed Budget';
          const amount = typeof budget.amount === 'number' ? budget.amount : 0;
          const balance = typeof budget.balance === 'number' ? budget.balance : 0;
          const endedAt = budget.endedAt || 'Unknown date';

          return (
            <div key={budget.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4">
              <h2 className="text-xl font-bold mb-2">{name}</h2>
              <p>Initial Amount: ${amount.toFixed(2)}</p>
              <p>Final Balance: ${balance.toFixed(2)}</p>
              <p>Ended: {new Date(endedAt).toLocaleString()}</p>
            </div>
          );
        })
      )}
    </div>
  );
}
