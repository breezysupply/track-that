'use client';

import React, { useEffect, useState } from 'react';
import AddBudgetCard from '../components/AddBudgetCard';
import BudgetCard from '../components/BudgetCard';
import AuthModal from '../components/AuthModal';
import { Budget } from '../types/Budget';
import { useAuth } from '../components/AuthContext';
import { collection, query, where, getDocs, runTransaction, doc } from 'firebase/firestore';
import { db } from '../src/firebase';
import { Firestore } from 'firebase/firestore';

export default function Home() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        fetchBudgets();
      } else {
        setShowAuthModal(true);
        setIsLoading(false);
      }
    }
  }, [user, loading]);

  const fetchBudgets = async () => {
    if (!user || !db) return;
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
      if (!user || !db) {
        throw new Error("User not authenticated or database not initialized");
      }
      await runTransaction(db, async (transaction) => {
        console.log('Starting transaction');
        // Add the ended budget to history in Firestore
        const historyRef = doc(collection(db as Firestore, 'budget_history'));
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

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    fetchBudgets();
  };

  if (loading || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-100"></div>
      </div>
    );
  }

  return (
    <>
      {showAuthModal && (
        <AuthModal isOpen={true} onClose={() => {}} onSuccess={handleAuthSuccess} />
      )}
      {user && (
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-100">Your Budgets</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {budgets.map((budget) => (
              <BudgetCard key={budget.id} budget={budget} onEndBudget={handleEndBudget} />
            ))}
            <AddBudgetCard />
          </div>
        </div>
      )}
    </>
  );
}
