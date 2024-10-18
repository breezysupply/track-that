'use client';

import { useAuth } from './AuthContext';
import { useRouter } from 'next/navigation';

export function SignOutButton() {
  const { signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/auth');
  };

  return (
    <button onClick={handleSignOut} className="text-gray-300 hover:text-white">
      Sign Out
    </button>
  );
}
