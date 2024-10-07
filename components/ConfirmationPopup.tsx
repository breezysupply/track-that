import React from 'react';

interface ConfirmationPopupProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmationPopup({ message, onConfirm, onCancel }: ConfirmationPopupProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-sm w-full shadow-xl">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Confirm Action</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p>
        <div className="flex justify-end space-x-2">
          <button 
            onClick={onCancel} 
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm} 
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200"
          >
            End Budget
          </button>
        </div>
      </div>
    </div>
  );
}
