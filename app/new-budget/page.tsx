'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const NewBudgetPageClient = dynamic(() => import('../../components/NewBudgetPageClient'), { ssr: false });

export default function NewBudgetPage() {
  return <NewBudgetPageClient />;
}
