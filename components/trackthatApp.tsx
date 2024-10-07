'use client';

import React, { useState, useEffect } from 'react';
import BudgetDisplay from './BudgetDisplay';
import TransactionForm from './TransactionForm';
import TransactionList from './TransactionList';
import { Budget } from '../types/Budget';
import { Transaction } from '../types/Transaction';

interface TrackThatAppProps {
  initialBudget: Budget;
}

export default function TrackThatApp({ initialBudget }: TrackThatAppProps) {
  const [budget, setBudget] = useState<Budget | null>(null);

  useEffect(() => {
    if (initialBudget) {
      const savedBudget = localStorage.getItem(`budget_${initialBudget.id}`);
      if (savedBudget) {
        setBudget(JSON.parse(savedBudget));
      } else {
        setBudget(initialBudget);
      }
    }
  }, [initialBudget]);

  useEffect(() => {
    if (budget) {
      localStorage.setItem(`budget_${budget.id}`, JSON.stringify(budget));
    }
  }, [budget]);

  console.log('Current budget state:', budget);

  if (!budget) {
    return <div>Loading budget details... Please wait.</div>;
  }

  const addTransaction = (description: string, amount: number) => {
    if (!budget) return;

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      description,
      amount,
      date: new Date().toISOString()
    };
    setBudget(prevBudget => ({
      ...prevBudget!,
      balance: prevBudget!.balance - amount,
      transactions: [...prevBudget!.transactions, newTransaction]
    }));
  };

  const deleteTransaction = (id: string) => {
    if (!budget) return;

    setBudget(prevBudget => {
      const transaction = prevBudget!.transactions.find(t => t.id === id);
      if (!transaction) return prevBudget;

      return {
        ...prevBudget!,
        balance: prevBudget!.balance + transaction.amount,
        transactions: prevBudget!.transactions.filter(t => t.id !== id)
      };
    });
  };

  return (
    <div className="max-w-4xl mx-auto bg-gray-200 dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden font-mono md:mt-4">
      <BudgetDisplay 
        budget={budget.amount}
        balance={budget.balance}
        onBudgetChange={(newBudget) => setBudget(prev => ({ ...prev!, amount: newBudget, balance: newBudget }))}
        budgetName={budget.name}
        onBudgetNameChange={(newName) => setBudget(prev => ({ ...prev!, name: newName }))}
      />
      <div className="p-4 md:p-6 bg-white dark:bg-gray-700">
        <TransactionForm onAddTransaction={addTransaction} />
        <TransactionList 
          transactions={budget.transactions} 
          onDeleteTransaction={deleteTransaction}
        />
      </div>
    </div>
  );
}