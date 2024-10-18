import React, { useState } from 'react';
import Link from 'next/link';
import { Budget } from '../types/Budget';
import ConfirmationPopup from './ConfirmationPopup';
import { doc, deleteDoc, getFirestore } from 'firebase/firestore';

interface BudgetCardProps {
  budget: Budget;
  onEndBudget: (budget: Budget) => void;
}

export default function BudgetCard({ budget, onEndBudget }: BudgetCardProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { name, balance, amount } = budget;
  const spent = amount - balance;
  const percentage = (spent / amount) * 100;

  const getProgressBarColor = () => {
    if (percentage >= 100) return 'bg-red-500';
    if (percentage >= 75) return 'bg-orange-500';
    return 'bg-blue-500';
  };

  const handleEndBudget = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowConfirmation(true);
  };

  const confirmEndBudget = async () => {
    try {
      await onEndBudget(budget);
      setShowConfirmation(false);
    } catch (error) {
      console.error("Error ending budget:", error);
      if (error instanceof Error) {
        alert(`Failed to end budget: ${error.message}`);
      } else {
        alert("Failed to end budget. Please try again.");
      }
    }
  };

  return (
    <>
      <Link href={`/budget/${budget.id}`}>
        <div className="bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
          <h2 className="text-xl font-semibold mb-4 text-white">{name}</h2>
          <p className="text-gray-300 mb-4">
            Spent: ${spent.toFixed(2)} / ${amount.toFixed(2)}
          </p>
          <div className="mb-4 bg-gray-700 rounded-full h-2">
            <div
              className={`rounded-full h-2 transition-all duration-300 ease-in-out ${getProgressBarColor()}`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            ></div>
          </div>
          <button
            onClick={handleEndBudget}
            className="btn btn-danger w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
          >
            End Budget
          </button>
        </div>
      </Link>

      {showConfirmation && (
        <ConfirmationPopup
          message={`Are you sure you want to end the "${name}" budget? This action cannot be undone.`}
          onConfirm={confirmEndBudget}
          onCancel={() => setShowConfirmation(false)}
        />
      )}
    </>
  );
}
