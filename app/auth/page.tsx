'use client';

import React, { useState } from 'react';
import Login from '../../components/Login';
import Signup from '../../components/Signup';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">{isLogin ? 'Log In' : 'Sign Up'}</h1>
      {isLogin ? <Login onSuccess={() => {}} onError={() => {}} /> : <Signup onSuccess={() => {}} onError={() => {}} />}
      <button
        onClick={() => setIsLogin(!isLogin)}
        className="mt-4 text-blue-500 hover:underline"
      >
        {isLogin ? 'Need an account? Sign up' : 'Already have an account? Log in'}
      </button>
    </div>
  );
};

export default AuthPage;

