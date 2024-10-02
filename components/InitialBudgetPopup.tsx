"use client";

import React, { useState } from 'react';

interface InitialBudgetPopupProps {
  onBudgetSet: (budget: number, name: string) => void;
}

export default function InitialBudgetPopup({ onBudgetSet }: InitialBudgetPopupProps) {
  const [budget, setBudget] = useState('');
  const [budgetName, setBudgetName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedBudget = parseFloat(budget);
    if (!isNaN(parsedBudget) && parsedBudget > 0 && budgetName.trim() !== '') {
      onBudgetSet(parsedBudget, budgetName.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">Set Initial Budget</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="budgetName" className="block mb-2 text-gray-700 dark:text-gray-300">Budget Name:</label>
            <input
              type="text"
              id="budgetName"
              value={budgetName}
              onChange={(e) => setBudgetName(e.target.value.slice(0, 75))}
              className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              maxLength={75}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="budget" className="block mb-2 text-gray-700 dark:text-gray-300">Budget Amount:</label>
            <input
              type="number"
              id="budget"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              required
              min="0.01"
              step="0.01"
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200"
          >
            Set Budget
          </button>
        </form>
      </div>
    </div>
  );
}
