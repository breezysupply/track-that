'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import InitialBudgetPopup from '../../components/InitialBudgetPopup';

export default function NewBudgetPage() {
  const router = useRouter();

  const handleBudgetSet = (amount: number, name: string) => {
    // Here you would typically save the new budget to your backend or local storage
    const newBudget = {
      id: Date.now().toString(), // This is a simple way to generate a unique ID
      name,
      amount,
      balance: amount,
      transactions: []
    };

    // Save to localStorage for now
    localStorage.setItem(`budget_${newBudget.id}`, JSON.stringify(newBudget));

    // Redirect to the new budget page
    router.push(`/budget/${newBudget.id}`);
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">Create New Budget</h1>
      <InitialBudgetPopup onBudgetSet={handleBudgetSet} />
    </div>
  );
}
