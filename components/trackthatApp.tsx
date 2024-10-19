'use client';

import React, { useState, useEffect } from 'react';
import BudgetDisplay from './BudgetDisplay';
import TransactionForm from './TransactionForm';
import TransactionList from './TransactionList';
import { Budget } from '../types/Budget';
import { Transaction } from '../types/Transaction';
import { updateDoc, doc, runTransaction, collection, Firestore } from 'firebase/firestore';
import { db } from '../src/firebase';
import { useRouter } from 'next/navigation';

interface TrackThatAppProps {
  initialBudget: Budget;
}

export default function TrackThatApp({ initialBudget }: TrackThatAppProps) {
  const [budget, setBudget] = useState<Budget | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (initialBudget) {
      setBudget(initialBudget);
    }
  }, [initialBudget]);

  useEffect(() => {
    if (budget && db) {
      const budgetToUpdate = {
        name: budget.name,
        amount: budget.amount,
        balance: budget.balance,
        transactions: budget.transactions.map(t => ({
          id: t.id,
          amount: t.amount,
          description: t.description,
          date: t.date
        }))
      };
      updateDoc(doc(db, 'budgets', budget.id), budgetToUpdate).catch(error => {
        console.error("Error updating budget:", error);
      });
    }
  }, [budget, db]);

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

  const endBudget = async () => {
    if (budget && db) {
      try {
        const endedBudget = {
          ...budget,
          endedAt: new Date().toISOString()
        };

        await runTransaction(db, async (transaction) => {
          // Add the ended budget to history in Firestore
          const historyRef = doc(collection(db, 'budget_history'));
          transaction.set(historyRef, endedBudget);
          // Delete the budget from Firestore
          const budgetRef = doc(db, 'budgets', budget.id);
          transaction.delete(budgetRef);
        });

        alert('Budget ended successfully');
        router.push('/history');
      } catch (error) {
        console.error("Error ending budget:", error);
        alert("Failed to end budget. Please try again.");
      }
    } else {
      alert("Budget not found or database not initialized");
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-gray-800 shadow-lg rounded-lg overflow-hidden font-mono md:mt-4">
      <BudgetDisplay 
        budget={budget.amount}
        balance={budget.balance}
        onBudgetChange={(newBudget) => setBudget(prev => ({ ...prev!, amount: newBudget, balance: newBudget }))}
        budgetName={budget.name}
        onBudgetNameChange={(newName) => setBudget(prev => ({ ...prev!, name: newName }))}
      />
      <div className="p-4 md:p-6 bg-gray-700">
        <TransactionForm onAddTransaction={addTransaction} />
        <TransactionList 
          transactions={budget.transactions} 
          onDeleteTransaction={deleteTransaction}
        />
        <button 
          onClick={endBudget}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          End Budget
        </button>
      </div>
    </div>
  );
}
