'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth';
import { getAuthInstance } from '../src/firebase';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const auth = getAuthInstance();
      console.log('Auth instance retrieved successfully');
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
        setLoading(false);
      });
      return () => unsubscribe();
    } catch (error) {
      console.error('Error getting auth instance:', error);
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const auth = getAuthInstance();
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signup = async (email: string, password: string) => {
    const auth = getAuthInstance();
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const signOut = async () => {
    const auth = getAuthInstance();
    await firebaseSignOut(auth);
    setUser(null);
    router.push('/');
  };

  const value = {
    user,
    loading,
    login,
    signup,
    signOut
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
