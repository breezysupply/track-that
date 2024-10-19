'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import InitialBudgetPopup from '../../components/InitialBudgetPopup';
import { useAuth } from '../../components/AuthContext';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../src/firebase';

export default function NewBudgetPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-100"></div>
    </div>;
  }

  const handleBudgetSet = async (amount: number, name: string) => {
    const newBudget = {
      userId: user.uid,
      name,
      amount,
      balance: amount,
      transactions: []
    };

    try {
      console.log('Attempting to add new budget:', newBudget);
      const docRef = await addDoc(collection(db, 'budgets'), newBudget);
      console.log('Budget added successfully, redirecting to:', `/budget/${docRef.id}`);
      router.push(`/budget/${docRef.id}`);
    } catch (error) {
      console.error("Error adding budget: ", error);
      if (error instanceof Error) {
        alert(`Failed to create budget: ${error.message}`);
      } else {
        alert("Failed to create budget. Please try again.");
      }
    }
  };

  return <InitialBudgetPopup onBudgetSet={handleBudgetSet} />;
}
