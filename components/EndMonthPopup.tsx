"use client";

import React from 'react';

interface EndMonthPopupProps {
  budget: number;
  balance: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function EndMonthPopup({ budget, balance, onConfirm, onCancel }: EndMonthPopupProps) {
  let message;
  const difference = Math.abs(balance);

  if (balance >= 0) {
    message = `Congratulations! You were $${difference.toFixed(2)} under budget this period!`;
  } else {
    message = `You went $${difference.toFixed(2)} over budget this period.`;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">End of Budget Period Summary</h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">{message}</p>
        <p className="mb-4 text-gray-700 dark:text-gray-300">Your initial budget was: ${budget.toFixed(2)}</p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
