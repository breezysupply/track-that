"use client";

import React, { useState } from 'react';
import { FaEdit } from 'react-icons/fa'; // Make sure to install react-icons if you haven't already

interface BudgetDisplayProps {
  budget: number | null;
  balance: number | null;
  onBudgetChange: (newBudget: number) => void;
  budgetName: string;
  onBudgetNameChange: (newName: string) => void;
}

export default function BudgetDisplay({ budget, balance, onBudgetChange, budgetName, onBudgetNameChange }: BudgetDisplayProps) {
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [newBudget, setNewBudget] = useState(budget?.toString() || '');
  const [isEditingName, setIsEditingName] = useState(false);
  const [newBudgetName, setNewBudgetName] = useState(budgetName);

  const spent = budget !== null && balance !== null ? budget - balance : 0;
  const progressPercentage = budget ? Math.min((spent / budget) * 100, 100) : 0;

  const handleEditClick = () => {
    if (isEditingBudget) {
      const parsedBudget = parseFloat(newBudget);
      if (!isNaN(parsedBudget) && parsedBudget > 0) {
        onBudgetChange(parsedBudget);
      }
    }
    setIsEditingBudget(!isEditingBudget);
  };

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewBudget(e.target.value);
  };

  const handleNameEditClick = () => {
    if (isEditingName) {
      onBudgetNameChange(newBudgetName);
    }
    setIsEditingName(!isEditingName);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewBudgetName(e.target.value.slice(0, 75));
  };

  return (
    <div className="bg-gray-800 dark:bg-gray-900 text-white p-6">
      <div className="flex justify-between items-center mb-4">
        {isEditingName ? (
          <input
            type="text"
            value={newBudgetName}
            onChange={handleNameChange}
            className="text-2xl font-bold bg-transparent border-b border-white"
            maxLength={75}
          />
        ) : (
          <h2 className="text-2xl font-bold">{budgetName}</h2>
        )}
        <button onClick={handleNameEditClick} className="text-white ml-2">
          <FaEdit />
        </button>
      </div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <span className="text-3xl font-bold mr-2">${balance?.toFixed(2)}</span>
          <span className="text-sm">left</span>
        </div>
        <div className="flex items-center">
          {isEditingBudget ? (
            <input
              type="number"
              value={newBudget}
              onChange={handleBudgetChange}
              className="w-32 p-1 mr-2 text-black rounded text-xl"
            />
          ) : (
            <span className="text-xl mr-2">/ ${budget?.toFixed(2)}</span>
          )}
          <button onClick={handleEditClick} className="text-white">
            <FaEdit />
          </button>
        </div>
      </div>
      <div className="mb-2">
        <div className="flex justify-between text-sm mb-1">
          <span>SPENT</span>
          <span>${spent.toFixed(2)}</span>
        </div>
        <div className="bg-gray-600 dark:bg-gray-700 rounded-full h-2">
          <div
            className={`rounded-full h-2 ${balance && balance < 0 ? 'bg-red-600' : 'bg-blue-600'}`}
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
