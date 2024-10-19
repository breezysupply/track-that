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

const HomePage: React.FC = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      setIsAuthModalOpen(true);
    }
  }, [user, loading]);

  useEffect(() => {
    const fetchBudgets = async () => {
      if (user && db) {
        const budgetsCollection = collection(db as Firestore, 'budgets');
        const q = query(budgetsCollection, where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const fetchedBudgets = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Budget));
        setBudgets(fetchedBudgets);
      }
    };

    if (user) {
      fetchBudgets();
    }
  }, [user, db]);

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
  };

  const handleEndBudget = async (budgetToEnd: Budget) => {
    if (db) {
      try {
        const endedBudget = {
          ...budgetToEnd,
          endedAt: new Date().toISOString()
        };

        await runTransaction(db as Firestore, async (transaction) => {
          const historyRef = doc(collection(db as Firestore, 'budget_history'));
          transaction.set(historyRef, endedBudget);
          const budgetRef = doc(db as Firestore, 'budgets', budgetToEnd.id);
          transaction.delete(budgetRef);
        });

        setBudgets(prevBudgets => prevBudgets.filter(b => b.id !== budgetToEnd.id));
      } catch (error) {
        console.error("Error ending budget:", error);
        throw error;
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Budgets</h1>
      {user ? (
        <>
          <AddBudgetCard />
          {budgets.map((budget) => (
            <BudgetCard key={budget.id} budget={budget} onEndBudget={handleEndBudget} />
          ))}
        </>
      ) : (
        <p>Please log in to view your budgets.</p>
      )}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};

export default HomePage;
