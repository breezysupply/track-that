'use client';

import React, { useEffect, useState } from 'react';
import { Budget } from '../../types/Budget';
import { useAuth } from '../../components/AuthContext';
import { collection, query, where, getDocs, writeBatch } from 'firebase/firestore';
import { db } from '../../src/firebase';

interface EndedBudget extends Budget {
  endedAt: string;
}

export default function History() {
  const [history, setHistory] = useState<EndedBudget[]>([]);
  const { user } = useAuth();

  const loadHistory = async () => {
    if (!user) return;
    const historyRef = collection(db, 'budget_history');
    const q = query(historyRef, where('userId', '==', user.uid));
    const querySnapshot = await getDocs(q);
    const fetchedHistory = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EndedBudget));
    const sortedHistory = fetchedHistory.sort((a, b) => 
      new Date(b.endedAt).getTime() - new Date(a.endedAt).getTime()
    );
    setHistory(sortedHistory);
  };

  useEffect(() => {
    if (user) {
      loadHistory();
    }
  }, [user]);

  const clearHistory = async () => {
    if (window.confirm('Are you sure you want to clear all history? This action cannot be undone.')) {
      if (!user) return;
      try {
        const historyRef = collection(db, 'budget_history');
        const q = query(historyRef, where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const batch = writeBatch(db);
        querySnapshot.forEach((doc) => {
          batch.delete(doc.ref);
        });
        await batch.commit();
        setHistory([]);
        alert('History cleared successfully');
      } catch (error) {
        console.error("Error clearing history:", error);
        alert("Failed to clear history. Please check your permissions and try again.");
      }
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Budget History</h1>
        <button 
          onClick={clearHistory}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
        >
          Clear History
        </button>
      </div>
      {history.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No budget history available.</p>
      ) : (
        history.map((budget) => (
          <div key={budget.id} className="bg-gray-800 rounded-lg shadow-md p-4 mb-4 text-white">
            <h2 className="text-xl font-bold mb-2">{budget.name}</h2>
            <p>Initial Amount: ${budget.amount.toFixed(2)}</p>
            <p>Final Balance: ${budget.balance.toFixed(2)}</p>
            <p>Ended: {new Date(budget.endedAt).toLocaleString()}</p>
          </div>
        ))
      )}
    </div>
  );
}
