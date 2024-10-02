"use client";

import React, { useState } from 'react';
import { Transaction } from '../types/Transaction';

interface TransactionFormProps {
  onAddTransaction: (description: string, amount: number) => void;
}

export default function TransactionForm({ onAddTransaction }: TransactionFormProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (description && !isNaN(parsedAmount) && parsedAmount > 0) {
      onAddTransaction(description, parsedAmount);
      setDescription('');
      setAmount('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="mb-4">
        <label htmlFor="amount" className="block mb-2 text-gray-800 dark:text-gray-200">Amount:</label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 border rounded bg-white dark:bg-gray-600 text-gray-800 dark:text-gray-200"
          required
          step="0.01"
          min="0.01"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="description" className="block mb-2 text-gray-800 dark:text-gray-200">Description:</label>
        <input
          type="text"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded bg-white dark:bg-gray-600 text-gray-800 dark:text-gray-200"
          required
        />
      </div>
      <button 
        type="submit" 
        className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 transition duration-200"
      >
        Add Transaction
      </button>
    </form>
  );
}
