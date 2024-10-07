'use client';

import React, { useEffect, useState } from 'react';
import AddBudgetCard from '../components/AddBudgetCard';
import BudgetCard from '../components/BudgetCard';
import { Budget } from '../types/Budget';

export default function Home() {
  const [budgets, setBudgets] = useState<Budget[]>([]);

  useEffect(() => {
    const storedBudgets = Object.keys(localStorage)
      .filter(key => key.startsWith('budget_'))
      .map(key => {
        try {
          const budget = JSON.parse(localStorage.getItem(key) || '');
          return budget && typeof budget === 'object' && budget.name && budget.name !== 'Unnamed Budget' ? budget : null;
        } catch {
          return null;
        }
      })
      .filter(Boolean);
    setBudgets(storedBudgets);
  }, []);

  const handleEndBudget = (endedBudget: Budget) => {
    console.log("Handling end budget in parent component", endedBudget);
    // Remove the budget from localStorage
    localStorage.removeItem(`budget_${endedBudget.id}`);

    // Add the budget to history
    const history = JSON.parse(localStorage.getItem('budget_history') || '[]');
    history.push({
      ...endedBudget,
      endedAt: new Date().toISOString()
    });
    localStorage.setItem('budget_history', JSON.stringify(history));

    // Update the budgets state
    setBudgets(prevBudgets => prevBudgets.filter(budget => budget.id !== endedBudget.id));
  };

  return (
    <div className="container mx-auto px-4 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Your Budgets</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {budgets.map((budget) => (
          <BudgetCard key={budget.id} budget={budget} onEndBudget={handleEndBudget} />
        ))}
        <AddBudgetCard />
      </div>
    </div>
  );
}