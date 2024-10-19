'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TrackThatApp from '../../../components/trackthatApp';
import { Budget } from '../../../types/Budget';
import { useAuth } from '../../../components/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../src/firebase';

export async function generateStaticParams() {
  return [];
}

export default function BudgetPage({ params }: { params: { id: string } }) {
  const [budget, setBudget] = useState<Budget | null>(null);
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchBudget = async () => {
      if (user) {
        const docRef = doc(db, 'budgets', params.id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().userId === user.uid) {
          setBudget({ id: docSnap.id, ...docSnap.data() } as Budget);
        } else {
          router.push('/');
        }
      }
    };
    fetchBudget();
  }, [params.id, user, router]);

  if (loading || !budget) {
    return <div>Loading budget... Please wait.</div>;
  }

  return <TrackThatApp initialBudget={budget} />;
}
