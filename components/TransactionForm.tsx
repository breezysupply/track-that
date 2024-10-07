"use client";

import React, { useState } from 'react';

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
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="mb-4">
        <label htmlFor="amount" className="block mb-2 text-gray-300 font-medium font-poppins">Amount:</label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="input text-base appearance-none monospace"
          required
          step="0.01"
          min="0.01"
          placeholder="0.00"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="description" className="block mb-2 text-gray-300 font-medium font-poppins">Description:</label>
        <input
          type="text"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input text-base font-poppins"
          required
          placeholder="Enter transaction description"
        />
      </div>
      <button 
        type="submit" 
        className="btn btn-primary w-full text-base font-poppins"
      >
        Add Transaction
      </button>
    </form>
  );
}