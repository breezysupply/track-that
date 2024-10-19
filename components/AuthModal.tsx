'use client';

import React, { useState } from 'react';
import Login from './Login';
import Signup from './Signup';
import { useRouter } from 'next/navigation';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  console.log('AuthModal rendered. isOpen:', isOpen);

  const handleSuccess = () => {
    console.log('Auth success');
    setError('');
    onClose();
    onSuccess();
  };

  const handleError = (errorMessage: string) => {
    console.error('Auth error:', errorMessage);
    setError(errorMessage);
  };

  if (!isOpen) {
    console.log('AuthModal not open, returning null');
    return null;
  }

  console.log('Rendering AuthModal content');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-8 rounded-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-white">{isLogin ? 'Log In' : 'Sign Up'}</h2>
        {isLogin ? 
          <Login onSuccess={handleSuccess} onError={handleError} /> : 
          <Signup onSuccess={handleSuccess} onError={handleError} />
        }
        {error && <p className="text-red-500 mt-2">{error}</p>}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="mt-4 text-blue-400 hover:underline"
        >
          {isLogin ? 'Need an account? Sign up' : 'Already have an account? Log in'}
        </button>
      </div>
    </div>
  );
};

export default AuthModal;
