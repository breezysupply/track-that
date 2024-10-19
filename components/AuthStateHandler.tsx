'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthContext';

export function AuthStateHandler() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user && window.location.pathname !== '/auth') {
        router.push('/auth');
      }
    }
  }, [user, loading, router]);

  return null;
}
