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

  console.log('HomePage rendered. User:', user, 'Loading:', loading);

  useEffect(() => {
    console.log('useEffect triggered. User:', user, 'Loading:', loading);
    if (!loading) {
      if (!user) {
        console.log('No user, opening AuthModal');
        setIsAuthModalOpen(true);
      } else {
        console.log('User found, fetching budgets');
        fetchBudgets();
      }
    }
  }, [user, loading]);

  const fetchBudgets = async () => {
    if (user && db) {
      try {
        const budgetsCollection = collection(db as Firestore, 'budgets');
        const q = query(budgetsCollection, where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const fetchedBudgets = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Budget));
        console.log('Fetched budgets:', fetchedBudgets);
        setBudgets(fetchedBudgets);
      } catch (error) {
        console.error('Error fetching budgets:', error);
      }
    }
  };

  const handleAuthSuccess = () => {
    console.log('Auth success, closing modal');
    setIsAuthModalOpen(false);
    fetchBudgets();
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

  if (loading) {
    console.log('Rendering loading spinner');
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-100"></div>
      </div>
    );
  }

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
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default HomePage;
