'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import InitialBudgetPopup from '../../components/InitialBudgetPopup';
import { useAuth } from '../../components/AuthContext';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../src/firebase';

export default function NewBudgetPage() {
  const router = useRouter();
  const { user } = useAuth();

  console.log('NewBudgetPage rendered, user:', user);

  const handleBudgetSet = async (amount: number, name: string) => {
    console.log('handleBudgetSet called with:', amount, name);
    if (!user) {
      console.log('No user, redirecting to auth');
      router.push('/auth');
      return;
    }

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

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">Create New Budget</h1>
      <InitialBudgetPopup onBudgetSet={handleBudgetSet} />
    </div>
  );
}
