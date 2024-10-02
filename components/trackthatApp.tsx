'use client';

import React, { useState, useEffect } from 'react';
import { Transaction } from '../types/Transaction';
import BudgetDisplay from './BudgetDisplay';
import TransactionForm from './TransactionForm';
import TransactionList from './TransactionList';
import InitialBudgetPopup from './InitialBudgetPopup';
import EndMonthPopup from './EndMonthPopup';
import confetti from 'canvas-confetti';

// Update the props interface for InitialBudgetPopup
export interface InitialBudgetPopupProps {
  onBudgetSet: (newBudget: number, newBudgetName: string) => void;
  month: string;
  year: number;
}

export default function TrackThatApp() {
  const [budget, setBudget] = useState<number | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showInitialBudgetPopup, setShowInitialBudgetPopup] = useState(false);
  const [showEndBudgetPopup, setShowEndBudgetPopup] = useState(false);
  const [budgetName, setBudgetName] = useState('New Budget');

  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear();

  useEffect(() => {
    const storedBudget = localStorage.getItem('current_budget');
    const storedBalance = localStorage.getItem('current_balance');
    const storedTransactions = localStorage.getItem('current_transactions');
    const storedBudgetName = localStorage.getItem('current_budget_name');
    
    if (storedBudget && storedBalance) {
      setBudget(parseFloat(storedBudget));
      setBalance(parseFloat(storedBalance));
      setShowInitialBudgetPopup(false);
    } else {
      setShowInitialBudgetPopup(true);
    }

    if (storedTransactions) {
      const parsedTransactions = JSON.parse(storedTransactions);
      setTransactions(parsedTransactions);
      
      // Recalculate balance based on loaded transactions
      if (storedBudget) {
        const initialBudget = parseFloat(storedBudget);
        const totalSpent = parsedTransactions.reduce((sum: number, t: Transaction) => sum + t.amount, 0);
        setBalance(initialBudget - totalSpent);
      }
    }

    if (storedBudgetName) {
      setBudgetName(storedBudgetName);
    }
  }, []);

  useEffect(() => {
    if (budget !== null && balance !== null) {
      localStorage.setItem('current_budget', budget.toString());
      localStorage.setItem('current_balance', balance.toString());
    }
    if (transactions.length > 0) {
      localStorage.setItem('current_transactions', JSON.stringify(transactions));
    }
  }, [budget, balance, transactions, currentMonth, currentYear]);

  const handleBudgetChange = (newBudget: number) => {
    setBudget(newBudget);
    setBalance(newBudget);
    setTransactions([]);
    setShowInitialBudgetPopup(false);
    
    localStorage.setItem('current_budget', newBudget.toString());
    localStorage.setItem('current_balance', newBudget.toString());
    localStorage.removeItem('current_transactions');
  };

  const handleBudgetNameChange = (newName: string) => {
    setBudgetName(newName);
    localStorage.setItem('current_budget_name', newName);
  };

  const addTransaction = (description: string, amount: number) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),  // Ensure this is a string
      description,
      amount,
      date: new Date().toISOString()  // Add the date property
    };
    const updatedTransactions = [...transactions, newTransaction];
    setTransactions(updatedTransactions);
    setBalance((prevBalance) => {
      const newBalance = prevBalance! - amount;
      localStorage.setItem('current_balance', newBalance.toString());
      return newBalance;
    });
    localStorage.setItem('current_transactions', JSON.stringify(updatedTransactions));
  };

  const deleteTransaction = (id: string) => {
    const transactionToDelete = transactions.find(t => t.id === id);
    if (transactionToDelete) {
      const updatedTransactions = transactions.filter(t => t.id !== id);
      setTransactions(updatedTransactions);
      setBalance((prevBalance) => {
        const newBalance = prevBalance! + transactionToDelete.amount;
        localStorage.setItem('current_balance', newBalance.toString());
        return newBalance;
      });
      localStorage.setItem('current_transactions', JSON.stringify(updatedTransactions));
    }
  };

  const handleEndMonth = () => {
    setShowEndBudgetPopup(true);
  };

  const handleEndBudgetConfirm = () => {
    if (balance! >= 0) {
      confetti();
    } else {
      document.body.style.animation = 'flash-red 0.5s';
      setTimeout(() => {
        document.body.style.animation = '';
      }, 500);
    }
    
    // Store the budget's data in history
    const historyData = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: budgetName, // Use the user-defined budget name
      budget: budget,
      finalBalance: balance,
      transactions: transactions,
      createdAt: Date.now() // Make sure this line is present
    };
    const history = JSON.parse(localStorage.getItem('budgetHistory') || '[]');
    history.push(historyData);
    localStorage.setItem('budgetHistory', JSON.stringify(history));

    // Clear current budget data from localStorage
    localStorage.removeItem('current_budget');
    localStorage.removeItem('current_balance');
    localStorage.removeItem('current_transactions');
    localStorage.removeItem('current_budget_name');

    // Reset state for the new budget
    setBudget(null);
    setBalance(null);
    setTransactions([]);
    setBudgetName('');
    setShowEndBudgetPopup(false);
    setShowInitialBudgetPopup(true);
  };

  const handleInitialBudgetSet = (newBudget: number, newBudgetName: string) => {
    setBudget(newBudget);
    setBalance(newBudget);
    setBudgetName(newBudgetName);
    setTransactions([]);
    setShowInitialBudgetPopup(false);
    
    localStorage.setItem('current_budget', newBudget.toString());
    localStorage.setItem('current_balance', newBudget.toString());
    localStorage.setItem('current_budget_name', newBudgetName);
    localStorage.removeItem('current_transactions');
  };

  if (showInitialBudgetPopup) {
    return <InitialBudgetPopup onBudgetSet={handleInitialBudgetSet} />;
  }

  return (
    <div className="max-w-4xl mx-auto bg-gray-200 dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden font-mono">
      <BudgetDisplay 
        budget={budget} 
        balance={balance} 
        onBudgetChange={handleBudgetChange}
        budgetName={budgetName}
        onBudgetNameChange={handleBudgetNameChange}
      />
      <div className="p-6 bg-white dark:bg-gray-700">
        <TransactionForm onAddTransaction={addTransaction} />
        <TransactionList 
          transactions={transactions} 
          onDeleteTransaction={deleteTransaction}
        />
        <button
          onClick={handleEndMonth}
          className="mt-4 w-full bg-red-500 text-white p-2 rounded hover:bg-red-600 transition duration-200"
        >
          End Budget Period
        </button>
      </div>
      {showInitialBudgetPopup && (
        <InitialBudgetPopup onBudgetSet={handleInitialBudgetSet} />
      )}
      {showEndBudgetPopup && (
        <EndMonthPopup
          budget={budget!}
          balance={balance!}
          onConfirm={handleEndBudgetConfirm}
          onCancel={() => setShowEndBudgetPopup(false)}
        />
      )}
    </div>
  );
}