'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AddBudgetCard from '../components/AddBudgetCard';
import BudgetCard from '../components/BudgetCard';
import { Budget } from '../types/Budget';
import { useAuth } from '../components/AuthContext';
import { collection, query, where, getDocs, deleteDoc, doc, addDoc, runTransaction } from 'firebase/firestore';
import { db } from '../src/firebase';
import Link from 'next/link';

export default function Home() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/auth');
      } else {
        fetchBudgets();
      }
    }
  }, [user, loading, router]);

  const fetchBudgets = async () => {
    if (!user) return;
    try {
      const q = query(collection(db, 'budgets'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const fetchedBudgets = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Budget));
      setBudgets(fetchedBudgets);
    } catch (error) {
      console.error("Error fetching budgets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndBudget = async (endedBudget: Budget) => {
    try {
      if (!user) {
        throw new Error("User not authenticated");
      }
      await runTransaction(db, async (transaction) => {
        console.log('Starting transaction');
        // Add the ended budget to history in Firestore
        const historyRef = doc(collection(db, 'budget_history'));
        console.log('Adding to history:', endedBudget);
        transaction.set(historyRef, {
          ...endedBudget,
          userId: user.uid,
          endedAt: new Date().toISOString()
        });

        // Delete the budget from Firestore
        const budgetRef = doc(db, 'budgets', endedBudget.id);
        console.log('Deleting budget:', endedBudget.id);
        transaction.delete(budgetRef);
      });

      console.log('Transaction completed');

      // Remove the ended budget from the state
      setBudgets(budgets.filter(budget => budget.id !== endedBudget.id));

      alert('Budget ended successfully');
    } catch (error) {
      console.error("Error ending budget:", error);
      if (error instanceof Error) {
        alert(`Failed to end budget: ${error.message}`);
      } else {
        alert("Failed to end budget. Please try again.");
      }
    }
  };

  if (loading) {
    return <div>Loading authentication...</div>;
  }

  if (isLoading) {
    return <div>Loading budgets...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-gray-100">Your Budgets</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {budgets.map((budget) => (
          <BudgetCard key={budget.id} budget={budget} onEndBudget={handleEndBudget} />
        ))}
        <AddBudgetCard />
      </div>
    </div>
  );
}
