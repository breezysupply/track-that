'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TrackThatApp from '../../../components/trackthatApp';
import { Budget } from '../../../types/Budget';

export default function BudgetPage({ params }: { params: { id: string } }) {
  const [budget, setBudget] = useState<Budget | null>(null);
  const router = useRouter();

  useEffect(() => {
    const savedBudget = localStorage.getItem(`budget_${params.id}`);
    if (savedBudget) {
      setBudget(JSON.parse(savedBudget));
    } else {
      router.push('/'); // Redirect to home if budget not found
    }
  }, [params.id, router]);

  if (!budget) {
    return <div>Loading budget... Please wait.</div>;
  }

  return <TrackThatApp initialBudget={budget} />;
}
